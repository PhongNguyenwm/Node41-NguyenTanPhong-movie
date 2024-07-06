import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieBookingDto } from './dto/create-movie_booking.dto';
import { UpdateMovieBookingDto } from './dto/update-movie_booking.dto';
import { PrismaClient, movie_booking } from '@prisma/client';

@Injectable()
export class MovieBookingService {
  prisma = new PrismaClient();
  async create(body: any): Promise<movie_booking> {
    const { user_id, schedule_id, seat_id } = body;
    const newTicket = await this.prisma.movie_booking.create({
      data: {
        user_id,
        schedule_id,
        seat_id,
      },
    });
    return newTicket;
  }

  async findAll(): Promise<movie_booking[]> {
    let data: movie_booking[] = await this.prisma.movie_booking.findMany();
    return data;
  }

  async findOne(id: number): Promise<movie_booking> {
    let data: movie_booking | null = await this.prisma.movie_booking.findFirst({
      where: { id },
    });
    if (!data) {
      throw new NotFoundException('Ticket not found');
    }
    return data;
  }

  async update(id: number, body: Partial<movie_booking>) {
    const exitingTicket = await this.prisma.movie_booking.findUnique({
      where: { id },
    });
    if (!exitingTicket) {
      throw new NotFoundException('Ticket not found');
    }

    const updateTicket = await this.prisma.movie_booking.update({
      where: { id },
      data: body,
    });
    return updateTicket;
  }

  async remove(id: number): Promise<{ message: string }> {
    const exitingTicket = await this.prisma.movie_booking.findUnique({
      where: { id },
    });
    if (!exitingTicket) {
      throw new NotFoundException('Ticket not found');
    }

    await this.prisma.movie_booking.delete({
      where: { id },
    });
    return { message: 'Ticket deleted successfully' };
  }
}
