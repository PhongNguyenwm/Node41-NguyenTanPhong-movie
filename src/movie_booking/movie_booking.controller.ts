import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MovieBookingService } from './movie_booking.service';
import { CreateMovieBookingDto } from './dto/create-movie_booking.dto';
import { UpdateMovieBookingDto } from './dto/update-movie_booking.dto';
import { movie_booking } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('movie-booking')
@Controller('movie-booking')
export class MovieBookingController {
  constructor(private readonly movieBookingService: MovieBookingService) {}

  @Post('booking-ticket')
  create(@Body() body: any) {
    return this.movieBookingService.create(body);
  }

  @Get('get-all-ticket')
  findAll(): Promise<movie_booking[]> {
    return this.movieBookingService.findAll();
  }

  @Get('get-ticket/:id')
  findOne(@Param('id') id: string): Promise<movie_booking> {
    return this.movieBookingService.findOne(+id);
  }

  @Patch('update-ticket/:id')
  update(@Param('id') id: string, @Body() body: Partial<movie_booking>) {
    return this.movieBookingService.update(+id, body);
  }

  @Delete('delete-ticket/:id')
  remove(@Param('id') id: string) {
    return this.movieBookingService.remove(+id);
  }
}
