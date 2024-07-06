import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieBookingDto } from './create-movie_booking.dto';

export class UpdateMovieBookingDto extends PartialType(CreateMovieBookingDto) {}
