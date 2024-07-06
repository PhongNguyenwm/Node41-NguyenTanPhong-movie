import {
  Controller,
  UseGuards,
  Get,
  Query,
  Optional,
  Param,
} from '@nestjs/common';
import { CinemaManagementService } from './cinema-management.service';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { cinema_chain, cinema_group, movie } from '@prisma/client';
import { CinemaChainResponseDto } from './dto/cinema-chain-responce.dtc';
import { CinemaGroupDto } from './dto/cinema-group.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('QuanLyRap')
@Controller('api/QuanLyRap')
export class CinemaManagementController {
  constructor(
    private readonly cinemaManagementService: CinemaManagementService,
  ) {}

  @Get('LayThongTinHeThongRap')
  @ApiQuery({ name: 'maHeThongRap', required: false })
  async findAll(
    @Query('maHeThongRap')
    maHeThongRap?: string,
  ): Promise<{
    statusCode: number;
    message: string;
    content: CinemaChainResponseDto[];
    dateTime: string;
    messageConstants: any;
  }> {
    let cinemas: CinemaChainResponseDto[];
    if (maHeThongRap) {
      cinemas = await this.cinemaManagementService.findAll(maHeThongRap);
    } else {
      cinemas = await this.cinemaManagementService.findAll();
    }
    return {
      statusCode: 200,
      message: 'Xử lý thành công!',
      content: cinemas,
      dateTime: new Date().toISOString(),
      messageConstants: null,
    };
  }

  @Get('LayThongTinCumRapTheoHeThong')
  @ApiQuery({ name: 'maCumRap', required: false })
  async findAllCinemaGroup(@Query('maCumRap') maCumRap?: string): Promise<{
    statusCode: number;
    message: string;
    content: CinemaGroupDto[];
    dateTime: string;
    messageConstants: any;
  }> {
    let cinemaGruops: CinemaGroupDto[];
    if (maCumRap) {
      cinemaGruops =
        await this.cinemaManagementService.findAllCinemaGroups(maCumRap);
    } else {
      cinemaGruops = await this.cinemaManagementService.findAllCinemaGroups();
    }
    return {
      statusCode: 200,
      message: 'Xử lý thành công!',
      content: cinemaGruops,
      dateTime: new Date().toISOString(),
      messageConstants: null,
    };
  }

  @Get('LayThongTinLichChieuRap/:id')
  findOne(@Param('id') id: string) {
    return this.cinemaManagementService.findOne(+id);
  }

  @Get('LayThongTinLichChieuPhim/:id')
  findOneMovie(@Param('id') id: string): Promise<movie> {
    return this.cinemaManagementService.findOneMovie(+id);
  }
}
