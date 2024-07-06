import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieScheduleDto } from './create-movie_schedule.dto';

export class UpdateMovieScheduleDto extends PartialType(CreateMovieScheduleDto) {}
