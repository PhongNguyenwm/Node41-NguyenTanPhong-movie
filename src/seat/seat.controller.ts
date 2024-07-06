import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SeatService } from './seat.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { seat } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('seat')
@Controller('seat')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Post('/create-seat')
  create(@Body() body: any) {
    return this.seatService.create(body);
  }

  @Get('/get-seat')
  findAll(): Promise<seat[]> {
    return this.seatService.findAll();
  }

  @Get('/detail-seat/:id')
  findOne(@Param('id') id: string) {
    return this.seatService.findOne(+id);
  }

  @Patch('/update-seat/:id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.seatService.update(+id, body);
  }

  @Delete('/delete-seat/:id')
  remove(@Param('id') id: string) {
    return this.seatService.remove(+id);
  }
}
