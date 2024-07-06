import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { MovieManagementService } from './movie_management.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { banner, movie } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Api200Response } from 'src/decorators/api-common-responses.decorator';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('QuanLyPhim')
@Controller('api/QuanLyPhim')
export class MovieManagementController {
  constructor(
    private readonly movieManagementService: MovieManagementService,
  ) {}

  @Get('LayDanhSachBanner')
  async findAllBanner(): Promise<banner[]> {
    return this.movieManagementService.findAllBanner();
  }

  @Get('LayDanhSachPhim')
  @ApiQuery({ name: 'tenPhim', required: false })
  async findAllMovie(@Query('tenPhim') tenPhim: string): Promise<movie[]> {
    if (tenPhim) {
      return this.movieManagementService.findMovieByName(tenPhim);
    } else {
      return this.movieManagementService.findAllMovie();
    }
  }

  @Get('LayDanhSachPhimPhanTrang')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'tenPhim', required: false })
  async getPaginateMovies(
    @Query('tenPhim') tenPhim?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ data: movie[]; total: number; page: number; limit: number }> {
    return this.movieManagementService.getPaginateMovies(page, limit, tenPhim);
  }

  @Get('LayDanhSachPhimTheoNgay')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getMovieByDate(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ data: movie[]; total: number; page: number; limit: number }> {
    return this.movieManagementService.getMovieByDateRange(
      startDate,
      endDate,
      page,
      limit,
    );
  }

  @Post('ThemPhimUploadHinh')
  @ApiConsumes('multipart/form-data')
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
  @ApiBody({
    description: 'Create movie',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        tenPhim: { type: 'string' },
        moTa: { type: 'string' },
        trailer: { type: 'string' },
        ngayChieu: { type: 'string', format: 'date' },
        danhGia: { type: 'number' },
        hot: { type: 'boolean' },
        dangChieu: { type: 'boolean' },
        sapChieu: { type: 'boolean' },
      },
    },
  })
  @Api200Response()
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateMovieDto,
  ) {
    return this.movieManagementService.create(file, body);
  }

  @Patch('CapNhatPhimUploadHinh/:id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update movie',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        tenPhim: { type: 'string', example: '' },
        moTa: { type: 'string', example: '' },
        trailer: { type: 'string', example: '' },
        ngayChieu: { type: 'string', format: 'date' },
        danhGia: { type: 'number' },
        hot: { type: 'boolean' },
        dangChieu: { type: 'boolean' },
        sapChieu: { type: 'boolean' },
      },
    },
  })
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
  @Api200Response()
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    if (body.hot !== undefined) {
      body.hot =
        body.hot === 'true' ? true : body.hot === 'false' ? false : body.hot;
    }
    if (body.dangChieu !== undefined) {
      body.dangChieu =
        body.dangChieu === 'true'
          ? true
          : body.dangChieu === 'false'
            ? false
            : body.dangChieu;
    }
    if (body.sapChieu !== undefined) {
      body.sapChieu =
        body.sapChieu === 'true'
          ? true
          : body.sapChieu === 'false'
            ? false
            : body.sapChieu;
    }

    const updateBody: UpdateMovieDto = body;
    console.log(body);
    return this.movieManagementService.update(+id, file, updateBody);
  }

  @Delete('XoaPhim/:id')
  remove(@Param('id') id: string) {
    return this.movieManagementService.remove(+id);
  }

  @Get('LayThongTinPhim/:id')
  findOne(@Param('id') id: string): Promise<movie> {
    return this.movieManagementService.findOne(+id);
  }
}
