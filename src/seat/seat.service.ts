import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { PrismaClient, seat } from '@prisma/client';

@Injectable()
export class SeatService {
  prisma = new PrismaClient();
  async create(body: any): Promise<seat> {
    const { seat_name, seat_type, cinema_id } = body;
    const newSeat = await this.prisma.seat.create({
      data: {
        seat_name,
        seat_type,
        cinema_id: cinema_id * 1,
      },
    });
    return newSeat;
  }

  async findAll(): Promise<seat[]> {
    let data: seat[] = await this.prisma.seat.findMany();
    return data;
  }

  async findOne(id: number): Promise<seat> {
    let data: seat | null = await this.prisma.seat.findFirst({
      where: { id },
    });
    if (!data) {
      throw new NotFoundException('seat not found');
    }
    return data;
  }

  async update(id: number, body: any): Promise<seat> {
    const exitingSeat = await this.prisma.seat.findUnique({
      where: { id },
    });
    if (!exitingSeat) {
      throw new NotFoundException('Seat not found');
    }

    const updateSeat = await this.prisma.seat.update({
      where: { id },
      data: body,
    });
    return updateSeat;
  }

  async remove(id: number): Promise<{ message: string }> {
    const exitingSeat = await this.prisma.seat.findUnique({
      where: { id },
    });
    if (!exitingSeat) {
      throw new NotFoundException('Seat not found');
    }

    await this.prisma.seat.delete({
      where: { id },
    });

    return { message: 'Seat deleted successfully' };
  }
}
