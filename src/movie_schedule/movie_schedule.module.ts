import { Module } from '@nestjs/common';
import { MovieScheduleService } from './movie_schedule.service';
import { MovieScheduleController } from './movie_schedule.controller';

@Module({
  controllers: [MovieScheduleController],
  providers: [MovieScheduleService],
})
export class MovieScheduleModule {}
