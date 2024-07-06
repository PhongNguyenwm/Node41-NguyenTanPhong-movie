import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CinemaGroupService } from './cinema_group.service';
import { UpdateCinemaGroupDto } from './dto/update-cinema_group.dto';
import { cinema_group } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('cinema_group')
@Controller('cinema-group')
export class CinemaGroupController {
  constructor(private readonly cinemaGroupService: CinemaGroupService) {}

  @Post('/create-group')
  create(@Body() body: any) {
    return this.cinemaGroupService.create(body);
  }

  @Get('/get-group')
  async findAll(): Promise<cinema_group[]> {
    return this.cinemaGroupService.findAll();
  }

  @Get('/detail-group/:id')
  findOne(@Param('id') id: string) {
    return this.cinemaGroupService.findOne(+id);
  }

  @Patch('/update-group/:id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.cinemaGroupService.update(+id, body);
  }

  @Delete('/delete-group/:id')
  remove(@Param('id') id: string) {
    return this.cinemaGroupService.remove(+id);
  }
}
