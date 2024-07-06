import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  HttpException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { QuanlydatveService } from './quanlydatve.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCinemaTicketDto } from './dto/create-cinema_ticket.dto';
import { AuthGuard } from '@nestjs/passport';
import { movie_schedule } from '@prisma/client';
import {
  Api200Response,
  Api500Response,
} from 'src/decorators/api-common-responses.decorator';
import { CreateCinemaScheduleDto } from './dto/create-cinema_schedule.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('QuanLyDatVe')
@Controller('/api/QuanLyDatVe')
export class QuanlydatveController {
  constructor(private readonly quanlydatveService: QuanlydatveService) {}

  @Post('DatVe')
  @ApiBody({
    description: 'DatVe',
    type: CreateCinemaTicketDto,
  })
  @Api200Response()
  @Api500Response()
  async createTicket(@Body() body: CreateCinemaTicketDto) {
    try {
      return this.quanlydatveService.createTicket(body);
    } catch (err) {
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'An error occurred while creating the movie booking.',
        error: 'Internal Server Error',
      });
    }
  }

  @Get('LayDanhSachPhongVe/:id')
  @Api200Response()
  @Api500Response()
  async findOne(@Param('id') id: number): Promise<movie_schedule> {
    try {
      return await this.quanlydatveService.findOne(+id);
    } catch (err) {
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'An error occurred while fetching the movie schedule.',
        error: 'Internal Server Error',
      });
    }
  }

  @Post('TaoLichChieu')
  @Api200Response()
  @Api500Response()
  async createCinemaSchedule(@Body() body: CreateCinemaScheduleDto) {
    return await this.quanlydatveService.createCinemaSchedule(body);
  }
}
