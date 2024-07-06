import { Injectable, NotFoundException, UploadedFile } from '@nestjs/common';
import { PrismaClient, movie } from '@prisma/client';

@Injectable()
export class MovieService {
  prisma = new PrismaClient();
  async create(file: Express.Multer.File, body: any): Promise<movie> {
    if (!file) {
      throw new NotFoundException('File is not uploaded');
    }
    const movieData: Partial<movie> = {
      ...body,
      image: file.filename,
      premiere_day: new Date(body.premiere_day),
      rating: Number(body.rating),
      hot: body.hot === 'true',
      showing: body.showing === 'true',
      showing_soon: body.showing_soon === 'true',
    };

    const newMovie = await this.prisma.movie.create({
      data: movieData,
    });
    return newMovie;
  }

  async findAll(): Promise<movie[]> {
    let data: movie[] = await this.prisma.movie.findMany();
    return data;
  }

  async findOne(id: number): Promise<movie> {
    let data: movie | null = await this.prisma.movie.findFirst({
      where: { id: id },
    });
    if (!data) {
      throw new NotFoundException('Movie not found');
    }
    return data;
  }

  async getPaginateMovies(
    page: number,
  ): Promise<{ data: movie[]; total: number; page: number }> {
    const limit = 10;
    const skip = (page - 1) * limit;
    const [total, data] = await this.prisma.$transaction([
      this.prisma.movie.count(),
      this.prisma.movie.findMany({ skip, take: limit }),
    ]);
    return { data, total, page };
  }

  async getMovieByDateRange(
    startDate: string,
    endDate: string,
    page: number,
  ): Promise<{ data: movie[]; total: number; page: number }> {
    const limit = 10;
    const skip = (page - 1) * limit;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const [total, data] = await this.prisma.$transaction([
      this.prisma.movie.count({
        where: {
          premiere_day: {
            gte: start,
            lte: end,
          },
        },
      }),
      this.prisma.movie.findMany({
        where: {
          premiere_day: {
            gte: start,
            lte: end,
          },
        },
        skip,
        take: limit,
      }),
    ]);
    return { data, total, page };
  }

  async update(
    id: number,
    file: Express.Multer.File,
    body: any,
  ): Promise<movie> {
    const exitingMovie = await this.prisma.movie.findUnique({
      where: { id },
    });
    if (!exitingMovie) {
      throw new NotFoundException('Movie not found');
    }

    const movieData: Partial<movie> = {
      ...body,
      image: file ? file.filename : exitingMovie.image,
      premiere_day: body.premiere_day
        ? new Date(body.premiere_date)
        : exitingMovie.premiere_day,
      rating: body.rating ? Number(body.rating) : exitingMovie.rating,
      hot: body.hot !== undefined ? body.hot === 'true' : exitingMovie.hot,
      showing:
        body.showing !== undefined
          ? body.showing === 'true'
          : exitingMovie.showing,
      showing_soon:
        body.showing_soon !== undefined
          ? body.showing_soon === 'true'
          : exitingMovie.showing_soon,
    };

    const updateMovie = await this.prisma.movie.update({
      where: { id },
      data: movieData,
    });

    return updateMovie;
  }

  async remove(id: number): Promise<{ message: string }> {
    const exitingMovie = await this.prisma.movie.findUnique({
      where: { id },
    });
    if (!exitingMovie) {
      throw new NotFoundException('Movie not found');
    }
    await this.prisma.movie.delete({
      where: { id },
    });
    return { message: 'Movie deleted successfully' };
  }
}
