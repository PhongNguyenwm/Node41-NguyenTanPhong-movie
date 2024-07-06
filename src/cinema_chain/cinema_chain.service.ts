import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCinemaChainDto } from './dto/create-cinema_chain.dto';
import { UpdateCinemaChainDto } from './dto/update-cinema_chain.dto';
import { PrismaClient, cinema_chain } from '@prisma/client';

@Injectable()
export class CinemaChainService {
  prisma = new PrismaClient();

  async create(file: Express.Multer.File, body: any): Promise<cinema_chain> {
    if (!file) {
      throw new NotFoundException('File is not uploaded');
    }
    const chainData: Partial<cinema_chain> = {
      ...body,
      logo: file.filename,
    };

    const newChain = await this.prisma.cinema_chain.create({
      data: chainData,
    });

    return newChain;
  }

  async findAll(): Promise<cinema_chain[]> {
    let data: cinema_chain[] = await this.prisma.cinema_chain.findMany();
    return data;
  }

  async findOne(id: number): Promise<cinema_chain> {
    let data: cinema_chain | null = await this.prisma.cinema_chain.findFirst({
      where: { id },
    });
    if (!data) {
      throw new NotFoundException('Chain not found');
    }
    return data;
  }

  async update(
    id: number,
    file: Express.Multer.File,
    body: any,
  ): Promise<cinema_chain> {
    const exitingChain = await this.prisma.cinema_chain.findUnique({
      where: { id },
    });
    if (!exitingChain) {
      throw new NotFoundException('Chain not found');
    }

    const chainData: Partial<cinema_chain> = {
      ...body,
      logo: file ? file.filename : exitingChain.logo,
    };

    const updateChain = await this.prisma.cinema_chain.update({
      where: { id },
      data: chainData,
    });
    return updateChain;
  }

  async remove(id: number): Promise<{ message: string }> {
    const exitingChain = await this.prisma.cinema_chain.findUnique({
      where: { id },
    });
    if (!exitingChain) {
      throw new NotFoundException('Chain not found');
    }
    await this.prisma.cinema_chain.delete({
      where: { id },
    });
    return { message: 'Chain deleted successfully' };
  }
}
