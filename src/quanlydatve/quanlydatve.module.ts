import { Module } from '@nestjs/common';
import { QuanlydatveService } from './quanlydatve.service';
import { QuanlydatveController } from './quanlydatve.controller';
import { MovieBookingService } from 'src/movie_booking/movie_booking.service';
import { MovieScheduleService } from 'src/movie_schedule/movie_schedule.service';
import { MovieBookingModule } from 'src/movie_booking/movie_booking.module';

@Module({
  // imports: [MovieBookingModule],
  controllers: [QuanlydatveController],
  providers: [QuanlydatveService, MovieBookingService, MovieScheduleService],
})
export class QuanlydatveModule {}
