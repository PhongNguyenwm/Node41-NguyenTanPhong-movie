import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient, user } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  prisma = new PrismaClient();

  async create(body: any): Promise<user> {
    const { fullname, email, password, phone, user_type } = body;
    if (!fullname || !email || !password || !phone || !user_type) {
      throw new BadRequestException('Missing required fields');
    }

    this.validatePassword(password);

    const exitingEmail = await this.prisma.user.findFirst({
      where: { email },
    });
    if (exitingEmail) {
      throw new ConflictException('Email already exists');
    }

    const exitingPhone = await this.prisma.user.findFirst({
      where: { phone: phone },
    });
    if (exitingPhone) {
      throw new ConflictException('Phone number already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    const newUser = await this.prisma.user.create({
      data: {
        fullname,
        email,
        password: hashedPassword,
        phone,
        user_type,
      },
    });
    return newUser;
  }

  async findAll(): Promise<user[]> {
    let data: user[] = await this.prisma.user.findMany();
    return data;
  }

  async getPaginateUser(
    page: number,
  ): Promise<{ data: user[]; total: number; page: number }> {
    const limit = 20;
    const skip = (page - 1) * limit;
    const [total, data] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.user.findMany({ skip, take: limit }),
    ]);
    return { data, total, page };
  }

  async findOne(id: number): Promise<user> {
    let data: user | null = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!data) {
      throw new NotFoundException('user not found');
    }
    return data;
  }

  async findUser(
    id?: number,
    name?: string,
    email?: string,
    phone?: string,
  ): Promise<user[]> {
    let data: user[];
    if (!id && !name && !email && !phone) {
      data = await this.prisma.user.findMany();
    } else {
      data = await this.prisma.user.findMany({
        where: {
          AND: [
            id ? { id } : {},
            name ? { fullname: { contains: name } } : {},
            email ? { email } : {},
            phone ? { phone } : {},
          ],
        },
      });
    }
    if (!data.length) {
      throw new NotFoundException('No user found');
    }
    return data;
  }

  async findPaginateUser(
    page: number,
    limit: number,
    id?: number,
    name?: string,
    email?: string,
    phone?: string,
  ): Promise<{ data: user[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    const where = {
      AND: [
        id ? { id } : {},
        name ? { fullname: { contains: name } } : {},
        email ? { email } : {},
        phone ? { phone } : {},
      ],
    };

    const [total, data] = await this.prisma.$transaction([
      this.prisma.user.count({
        where: name || id || email || phone ? where : {},
      }),
      this.prisma.user.findMany({
        where: name || id || email || phone ? where : {},
        skip,
        take: limit,
      }),
    ]);
    return { data, total, page, limit };
  }

  async update(id: number, body: Partial<user>): Promise<user> {
    const exitingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!exitingUser) {
      throw new NotFoundException('User not found');
    }
    if (body.password) {
      this.validatePassword(body.password);
      body.password = await bcrypt.hash(body.password, 5);
    }
    const updateUser = await this.prisma.user.update({
      where: { id },
      data: body,
    });
    return updateUser;
  }

  async remove(id: number): Promise<{ message: string }> {
    const exitingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!exitingUser) {
      throw new NotFoundException('User not found');
    }
    await this.prisma.user.delete({
      where: { id },
    });
    return { message: 'User deleted successfully' };
  }

  private validatePassword(password: string): void {
    if (password.length < 8) {
      throw new BadRequestException(
        'Password must be at least 8 characters long(>8)',
      );
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      throw new BadRequestException(
        'Password must contain both uppercase and lowercase letters(A-a)',
      );
    }

    if (!/\d/.test(password)) {
      throw new BadRequestException(
        'Password must contain at least one digit (0-9)',
      );
    }

    if (!/[!@#$%^&*()]/.test(password)) {
      throw new BadRequestException(
        'Password must contain at least one special character (!@#$%^&*())',
      );
    }
  }
}
