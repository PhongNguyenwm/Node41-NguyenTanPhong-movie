import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { PrismaClient, banner } from '@prisma/client';

@Injectable()
export class BannerService {
  prisma = new PrismaClient();
  async create(file: Express.Multer.File, body: any): Promise<banner> {
    if (!file) {
      throw new NotFoundException('File is not uploaded');
    }
    const bannerData: Partial<banner> = {
      ...body,
      movie_id: body.movie_id * 1,
      banner_image: file.filename,
    };

    const newBanner = await this.prisma.banner.create({
      data: bannerData,
    });

    return newBanner;
  }

  async findAll(): Promise<banner[]> {
    let data: banner[] = await this.prisma.banner.findMany();
    return data;
  }

  async findOne(id: number): Promise<banner> {
    let data: banner | null = await this.prisma.banner.findFirst({
      where: { id: id },
    });
    if (!data) {
      throw new NotFoundException('Banner not found');
    }
    return data;
  }

  async update(
    id: number,
    file: Express.Multer.File,
    body: any,
  ): Promise<banner> {
    const exitingBanner = await this.prisma.banner.findUnique({
      where: { id },
    });
    if (!exitingBanner) {
      throw new NotFoundException('Banner not found');
    }

    const bannerData: Partial<banner> = {
      ...body,
      movie_id: body.movie_id ? body.movie_id * 1 : exitingBanner.movie_id,
      banner_image: file ? file.filename : exitingBanner.banner_image,
    };

    const updateBanner = await this.prisma.banner.update({
      where: { id },
      data: bannerData,
    });
    return updateBanner;
  }

  async remove(id: number): Promise<{ message: string }> {
    const exitingBanner = await this.prisma.banner.findUnique({
      where: { id },
    });
    if (!exitingBanner) {
      throw new NotFoundException('Banner not found');
    }
    await this.prisma.banner.delete({
      where: { id },
    });
    return { message: 'Banner deleted successfully' };
  }
}
