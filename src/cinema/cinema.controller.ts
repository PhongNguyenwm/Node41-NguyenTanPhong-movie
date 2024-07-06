import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CinemaService } from './cinema.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import { cinema } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('cinema')
@Controller('cinema')
export class CinemaController {
  constructor(private readonly cinemaService: CinemaService) {}

  @Post('create-cinema')
  create(@Body() body: any) {
    return this.cinemaService.create(body);
  }

  @Get('get-cinema')
  async findAll(): Promise<cinema[]> {
    return this.cinemaService.findAll();
  }

  @Get('/detail-cinema/:id')
  findOne(@Param('id') id: string) {
    return this.cinemaService.findOne(+id);
  }

  @Patch('/update-cinema/:id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.cinemaService.update(+id, body);
  }

  @Delete('/delete-cinema/:id')
  remove(@Param('id') id: string) {
    return this.cinemaService.remove(+id);
  }
}
