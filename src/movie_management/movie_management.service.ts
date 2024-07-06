import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient, banner, movie } from '@prisma/client';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MovieManagementService {
  prisma = new PrismaClient();

  async findAllBanner(): Promise<banner[]> {
    let data: banner[] = await this.prisma.banner.findMany();
    return data;
  }

  async findAllMovie(): Promise<movie[]> {
    let data: movie[] = await this.prisma.movie.findMany();
    return data;
  }

  async findMovieByName(tenPhim: string): Promise<movie[]> {
    const keywords = tenPhim.toLowerCase();
    return this.prisma.movie.findMany({
      where: {
        movie_name: {
          contains: keywords,
        },
      },
    });
  }

  async getPaginateMovies(
    page: number,
    limit: number,
    tenPhim?: string,
  ): Promise<{ data: movie[]; total: number; page: number; limit: number }> {
    try {
      page = page && page > 0 ? parseInt(page as any, 10) : 1;
      limit = limit && limit > 0 ? parseInt(limit as any, 10) : 10;

      const skip = (page - 1) * limit;
      const keyword = tenPhim?.toLowerCase();
      const where = tenPhim
        ? {
            movie_name: { contains: keyword },
          }
        : {};

      const [total, data] = await this.prisma.$transaction([
        this.prisma.movie.count({ where }),
        this.prisma.movie.findMany({ skip, take: limit, where }),
      ]);
      return { data, total, page, limit };
    } catch (error) {
      console.error('Error fetching paginated movies:', error);
      throw new Error('Unable to fetch paginated movies');
    }
  }

  async getMovieByDateRange(
    startDate: string,
    endDate: string,
    page: number,
    limit: number,
  ): Promise<{ data: movie[]; total: number; page: number; limit: number }> {
    page = page && page > 0 ? parseInt(page as any, 10) : 1;
    limit = limit && limit > 0 ? parseInt(limit as any, 10) : 10;
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
    return { data, total, page, limit };
  }

  async create(
    file: Express.Multer.File,
    body: CreateMovieDto,
  ): Promise<movie> {
    try {
      const {
        tenPhim,
        moTa,
        trailer,
        hinhAnh,
        ngayChieu,
        danhGia,
        hot,
        dangChieu,
        sapChieu,
      } = body;
      if (!file) {
        throw new NotFoundException('File is not uploaded');
      }
      const movieData: Partial<movie> = {
        movie_name: tenPhim,
        description: moTa,
        trailer,
        image: file.filename,
        premiere_day: new Date(ngayChieu),
        rating: Number(danhGia),
        hot: Boolean(hot),
        showing: Boolean(dangChieu),
        showing_soon: Boolean(sapChieu),
      };

      const newMovie = await this.prisma.movie.create({
        data: movieData,
      });
      return newMovie;
    } catch (error) {
      console.error('Error fetching paginated movies:', error);
      throw new Error('Unable to fetch paginated movies');
    }
  }

  async update(
    id: number,
    file: Express.Multer.File,
    body: UpdateMovieDto,
  ): Promise<movie> {
    try {
      const movieId = +id;
      const existingMovie = await this.prisma.movie.findUnique({
        where: { id: movieId },
      });
      //   console.log(existingMovie);
      if (!existingMovie) {
        throw new NotFoundException('Movie not found');
      }

      let updateData: any = {
        movie_name: existingMovie.movie_name,
        description: existingMovie.description,
        trailer: existingMovie.trailer,
        premiere_day: existingMovie.premiere_day,
        rating: existingMovie.rating,
        hot: existingMovie.hot,
        showing: existingMovie.showing,
        showing_soon: existingMovie.showing_soon,
        image: existingMovie.image,
      };

      if (file) {
        updateData.image = file.filename;
      }

      if (body.tenPhim !== undefined) {
        updateData.movie_name = body.tenPhim;
      }
      if (body.moTa !== undefined) {
        updateData.description = body.moTa;
      }
      if (body.trailer !== undefined) {
        updateData.trailer = body.trailer;
      }
      if (body.ngayChieu !== undefined) {
        updateData.premiere_day = new Date(body.ngayChieu);
      }
      if (body.danhGia !== undefined) {
        updateData.rating = Number(body.danhGia);
      }
      if (body.hot !== undefined) {
        updateData.hot = body.hot;
      }
      if (body.dangChieu !== undefined) {
        updateData.showing = body.dangChieu;
      }
      if (body.sapChieu !== undefined) {
        updateData.showing_soon = body.sapChieu;
      }
      //   console.log(updateData);
      const updatedMovie = await this.prisma.movie.update({
        where: { id: movieId },
        data: updateData,
      });

      return updatedMovie;
    } catch (error) {
      console.error('Error fetching paginated movies:', error);
      throw new Error('Unable to fetch paginated movies');
    }
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

  async findOne(id: number): Promise<movie> {
    let data: movie | null = await this.prisma.movie.findFirst({
      where: { id: id },
    });
    if (!data) {
      throw new NotFoundException('Movie not found');
    }
    return data;
  }
}
