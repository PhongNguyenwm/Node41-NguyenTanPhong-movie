import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieScheduleDto } from './dto/create-movie_schedule.dto';
import { UpdateMovieScheduleDto } from './dto/update-movie_schedule.dto';
import { PrismaClient, movie_schedule } from '@prisma/client';

@Injectable()
export class MovieScheduleService {
  prisma = new PrismaClient();
  async create(body: any): Promise<movie_schedule> {
    const { cinema_id, movie_id, showing_datetime, ticket_price } = body;
    const newMovieSchedule = await this.prisma.movie_schedule.create({
      data: {
        cinema_id: Number(cinema_id),
        movie_id: Number(movie_id),
        showing_datetime: new Date(showing_datetime),
        ticket_price: Number(ticket_price),
      },
    });
    return newMovieSchedule;
  }

  async findAll(): Promise<movie_schedule[]> {
    const data: movie_schedule[] = await this.prisma.movie_schedule.findMany();
    return data;
  }

  async findOne(id: number): Promise<movie_schedule> {
    const data: movie_schedule | null =
      await this.prisma.movie_schedule.findFirst({
        where: { id },
      });
    if (!data) {
      throw new NotFoundException('movie_schedule not found');
    }
    return data;
  }

  async update(id: number, body: any): Promise<movie_schedule> {
    const exitingMovieSchedule = await this.prisma.movie_schedule.findUnique({
      where: { id },
    });
    if (!exitingMovieSchedule) {
      throw new NotFoundException('Movie Schedule not found');
    }
    if (body.showing_dateime) {
      body.showing_datetime = new Date(body.showing_datetime).toISOString();
    }
    const updateMovieSchedule = await this.prisma.movie_schedule.update({
      where: { id },
      data: {
        ...exitingMovieSchedule,
        ...body,
      },
    });
    return updateMovieSchedule;
  }

  async remove(id: number): Promise<{ message: String }> {
    const exitingMovieSchedule = await this.prisma.movie_schedule.findUnique({
      where: { id },
    });
    if (!exitingMovieSchedule) {
      throw new NotFoundException('Movie Schedue not found');
    }

    await this.prisma.movie_schedule.delete({
      where: { id },
    });
    return { message: 'Movie Schedule deleted successfully' };
  }
}
