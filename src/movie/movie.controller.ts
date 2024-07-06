import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { movie } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('movie')
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.cwd() + '/public/img',
        filename: (req, file, callback) => {
          const uniqueSuffix = new Date().getTime();
          const filename = uniqueSuffix + '_' + file.originalname;
          callback(null, filename);
        },
      }),
    }),
  )
  @Post('/create-movie')
  async create(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    return this.movieService.create(file, body);
  }

  @Get('/get-movie')
  findAll(): Promise<movie[]> {
    return this.movieService.findAll();
  }

  @Get('/detail-movie/:id')
  findOne(@Param('id') id: string): Promise<movie> {
    return this.movieService.findOne(+id);
  }

  @Get('/get-movie-pagination')
  async getPaginateMovies(
    @Query('page') page: number = 1,
  ): Promise<{ data: movie[]; total: number; page: number }> {
    return this.movieService.getPaginateMovies(page);
  }

  @Get('getmovie-by-date-range')
  async getMovieByDate(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('page') page: number = 1,
  ): Promise<{ data: movie[]; total: number; page: number }> {
    return this.movieService.getMovieByDateRange(startDate, endDate, page);
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.cwd() + '/public/img',
        filename: (req, file, callback) => {
          const uniqueSuffix = new Date().getTime();
          const filename = uniqueSuffix + '_' + file.originalname;
          callback(null, filename);
        },
      }),
    }),
  )
  @Patch('/update-movie/:id')
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    return this.movieService.update(+id, file, body);
  }

  @Delete('/delete-movie/:id')
  remove(@Param('id') id: string) {
    return this.movieService.remove(+id);
  }
}
