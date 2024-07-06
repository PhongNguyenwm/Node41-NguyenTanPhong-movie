import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCinemaGroupDto } from './dto/create-cinema_group.dto';
import { UpdateCinemaGroupDto } from './dto/update-cinema_group.dto';
import { PrismaClient, cinema_group } from '@prisma/client';

@Injectable()
export class CinemaGroupService {
  prisma = new PrismaClient();
  async create(body: any): Promise<cinema_group> {
    const { group_name, address, cinema_chain_id } = body;
    const newCinemaGroup = await this.prisma.cinema_group.create({
      data: {
        group_name,
        address,
        cinema_chain_id: cinema_chain_id * 1,
      },
    });
    return newCinemaGroup;
  }

  async findAll(): Promise<cinema_group[]> {
    let data: cinema_group[] = await this.prisma.cinema_group.findMany();
    return data;
  }

  async findOne(id: number): Promise<cinema_group> {
    let data: cinema_group | null = await this.prisma.cinema_group.findFirst({
      where: { id },
    });
    if (!data) {
      throw new NotFoundException('Group not found');
    }
    return data;
  }

  async update(id: number, body: any): Promise<cinema_group> {
    const exitingGroup = await this.prisma.cinema_group.findUnique({
      where: { id },
    });
    if (!exitingGroup) {
      throw new NotFoundException('Group not found');
    }

    const updateGroup = await this.prisma.cinema_group.update({
      where: { id },
      data: body,
    });
    return updateGroup;
  }

  async remove(id: number): Promise<{ message: string }> {
    const exitingGroup = await this.prisma.cinema_group.findUnique({
      where: { id },
    });
    if (!exitingGroup) {
      throw new NotFoundException('Group not found');
    }

    await this.prisma.cinema_group.delete({
      where: { id },
    });
    return { message: 'Group deleted successfully' };
  }
}
