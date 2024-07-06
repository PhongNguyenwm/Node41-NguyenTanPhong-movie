import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MovieScheduleService } from './movie_schedule.service';
import { CreateMovieScheduleDto } from './dto/create-movie_schedule.dto';
import { UpdateMovieScheduleDto } from './dto/update-movie_schedule.dto';

@Controller('movie-schedule')
export class MovieScheduleController {
  constructor(private readonly movieScheduleService: MovieScheduleService) {}

  @Post('/create-schedule')
  create(@Body() body: any) {
    return this.movieScheduleService.create(body);
  }

  @Get('/get-schedule')
  findAll() {
    return this.movieScheduleService.findAll();
  }

  @Get('/detail-schedule/:id')
  findOne(@Param('id') id: string) {
    return this.movieScheduleService.findOne(+id);
  }

  @Patch('/update-schedule/:id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.movieScheduleService.update(+id, body);
  }

  @Delete('/delete-schedule/:id')
  remove(@Param('id') id: string) {
    return this.movieScheduleService.remove(+id);
  }
}
