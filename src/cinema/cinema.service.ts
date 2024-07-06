import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import { PrismaClient, cinema } from '@prisma/client';

@Injectable()
export class CinemaService {
  prisma = new PrismaClient();
  async create(body: any): Promise<cinema> {
    const { cinema_name, cinema_group_id } = body;
    const newCinema = await this.prisma.cinema.create({
      data: {
        cinema_name,
        cinema_group_id: cinema_group_id * 1,
      },
    });
    return newCinema;
  }

  async findAll(): Promise<cinema[]> {
    let data: cinema[] = await this.prisma.cinema.findMany();
    return data;
  }

  async findOne(id: number): Promise<cinema> {
    let data: cinema | null = await this.prisma.cinema.findFirst({
      where: { id },
    });
    if (!data) {
      throw new NotFoundException('Cinema not found');
    }
    return data;
  }

  async update(id: number, body: any): Promise<cinema> {
    const exitingCinema = await this.prisma.cinema.findUnique({
      where: { id },
    });
    if (!exitingCinema) {
      throw new NotFoundException('Cinema not found');
    }

    const updateCinema = await this.prisma.cinema.update({
      where: { id },
      data: body,
    });
    return updateCinema;
  }

  async remove(id: number): Promise<{ message: string }> {
    const exitingCinema = await this.prisma.cinema.findUnique({
      where: { id },
    });
    if (!exitingCinema) {
      throw new NotFoundException('Cinema not found');
    }

    await this.prisma.movie_schedule.updateMany({
      where: { cinema_id: id },
      data: { cinema_id: null },
    });

    await this.prisma.seat.updateMany({
      where: { cinema_id: id },
      data: { cinema_id: null },
    });

    await this.prisma.cinema.delete({
      where: { id },
    });
    return { message: 'cinema deleted successfully' };
  }
}
