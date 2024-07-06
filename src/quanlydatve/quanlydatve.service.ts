import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { movie_booking, PrismaClient, movie_schedule } from '@prisma/client';
import { CreateCinemaTicketDto } from './dto/create-cinema_ticket.dto';
import { CreateCinemaScheduleDto } from './dto/create-cinema_schedule.dto';

@Injectable()
export class QuanlydatveService {
  prisma = new PrismaClient();
  async createTicket(body: CreateCinemaTicketDto): Promise<movie_booking> {
    const { maKhachHang, maLichChieu, maGhe } = body;
    return await this.prisma.movie_booking.create({
      data: {
        user_id: maKhachHang,
        schedule_id: maLichChieu,
        seat_id: maGhe,
      },
    });
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

  async createCinemaSchedule(
    body: CreateCinemaScheduleDto,
  ): Promise<movie_schedule> {
    const { maPhim, giaVe, ngayChieuGioChieu, maRap } = body;
    return await this.prisma.movie_schedule.create({
      data: {
        movie_id: maPhim,
        showing_datetime: ngayChieuGioChieu,
        cinema_id: maRap,
        ticket_price: giaVe,
      },
    });
  }
}
