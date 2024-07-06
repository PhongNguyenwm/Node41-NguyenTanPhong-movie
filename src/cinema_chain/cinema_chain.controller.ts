import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
  Delete,
} from '@nestjs/common';
import { CinemaChainService } from './cinema_chain.service';
import { CreateCinemaChainDto } from './dto/create-cinema_chain.dto';
import { UpdateCinemaChainDto } from './dto/update-cinema_chain.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { cinema_chain } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('cinema_chain')
@Controller('cinema-chain')
export class CinemaChainController {
  constructor(private readonly cinemaChainService: CinemaChainService) {}

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
  @Post('/create-chain')
  create(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    return this.cinemaChainService.create(file, body);
  }

  @Get('/get-chain')
  findAll(): Promise<cinema_chain[]> {
    return this.cinemaChainService.findAll();
  }

  @Get('/detail-chain/:id')
  findOne(@Param('id') id: string) {
    return this.cinemaChainService.findOne(+id);
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
  @Patch('/update-chain/:id')
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    return this.cinemaChainService.update(+id, file, body);
  }

  @Delete('/delete-chain/:id')
  remove(@Param('id') id: string) {
    return this.cinemaChainService.remove(+id);
  }
}
