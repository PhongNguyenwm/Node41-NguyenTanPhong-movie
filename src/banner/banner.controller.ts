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
} from '@nestjs/common';
import { BannerService } from './banner.service';
import { banner } from '@prisma/client';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('banner')
@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

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
  @Post('/create-banner')
  create(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    return this.bannerService.create(file, body);
  }

  @Get('/get-banner')
  findAll(): Promise<banner[]> {
    return this.bannerService.findAll();
  }

  @Get('/detail-banner/:id')
  findOne(@Param('id') id: string) {
    return this.bannerService.findOne(+id);
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
  @Patch('/update-banner/:id')
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    return this.bannerService.update(+id, file, body);
  }

  @Delete('/delete-banner/:id')
  remove(@Param('id') id: string) {
    return this.bannerService.remove(+id);
  }
}
