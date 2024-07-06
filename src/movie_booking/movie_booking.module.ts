import { Module } from '@nestjs/common';
import { MovieBookingService } from './movie_booking.service';
import { MovieBookingController } from './movie_booking.controller';

@Module({
  controllers: [MovieBookingController],
  providers: [MovieBookingService],
})
export class MovieBookingModule {}
