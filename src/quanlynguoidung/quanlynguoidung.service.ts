import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserTypeDto } from './dto/user-type.dto';
import { UserDto } from './dto/user.dto';
import { PrismaClient, user, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { FindUserDto } from './dto/find-user.dto';
import { AddUser } from './dto/add-user.dto';

@Injectable()
export class QuanlynguoidungService {
  prisma = new PrismaClient();
  constructor(private jwtService: JwtService) {}

  getUserTypes(): UserTypeDto[] {
    return [
      { maLoaiNguoiDung: 'USER', tenLoai: 'Khách hàng' },
      { maLoaiNguoiDung: 'ADMIN', tenLoai: 'Quản trị' },
    ];
  }

  async signup(body: UserDto): Promise<user> {
    const { hoTen, email, soDienThoai, matKhau } = body;
    if (!hoTen || !email || !matKhau || !soDienThoai) {
      throw new BadRequestException('Missing required fields');
    }

    this.validatePassword(matKhau);

    const exitingEmail = await this.prisma.user.findFirst({
      where: { email },
    });
    if (exitingEmail) {
      throw new ConflictException('Email already exists');
    }

    const exitingPhone = await this.prisma.user.findFirst({
      where: { phone: soDienThoai },
    });
    if (exitingPhone) {
      throw new ConflictException('Phone number already exists');
    }

    const hashedPassword = await bcrypt.hash(matKhau, 5);
    return await this.prisma.user.create({
      data: {
        fullname: hoTen,
        email,
        phone: soDienThoai,
        password: hashedPassword,
        user_type: 'user',
      },
    });
  }

  async login(body: LoginDto) {
    const { email, matKhau } = body;
    if (!email || !matKhau) {
      throw new BadRequestException('Missing required fields');
    }

    const user = await this.prisma.user.findFirst({
      where: { email: email },
    });
    if (!user) {
      throw new BadRequestException('Invalid email');
    }
    if (!(await bcrypt.compare(matKhau, user.password))) {
      throw new BadRequestException('Invalid password');
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload, {
      expiresIn: '1h',
      algorithm: 'HS256',
      secret: 'BI_MAT',
    });
    return { token };
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

  async findUser(tuKhoa: string): Promise<user[]> {
    const keyword = tuKhoa.toLowerCase();
    const data = await this.prisma.user.findMany({
      where: {
        OR: [
          { id: parseInt(keyword) || -1 },
          { fullname: { contains: keyword } },
          { email: { contains: keyword } },
          { phone: { contains: keyword } },
        ],
      },
    });
    if (!data.length) {
      throw new NotFoundException('No user found');
    }
    return data;
  }

  async findPaginateUser(
    tuKhoa: string,
    page: number,
    limit: number,
  ): Promise<{ data: user[]; total: number; page: number; limit: number }> {
    try {
      const skip = (page - 1) * limit;
      const keyword = tuKhoa.toLowerCase();

      const where = {
        OR: [
          { id: parseInt(keyword) || -1 },
          { fullname: { contains: keyword } },
          { email: { contains: keyword } },
          { phone: { contains: keyword } },
        ],
      };

      const [total, data] = await this.prisma.$transaction([
        this.prisma.user.count({ where }),
        this.prisma.user.findMany({ where, skip, take: limit }),
      ]);

      if (!data.length) {
        throw new NotFoundException('No user found');
      }

      return { data, total, page, limit };
    } catch (err) {
      console.error('Error finding paginated users:', err);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async getUserProfile(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token, { secret: 'BI_MAT' });

      const userId = decoded.sub;

      const userProfile = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          movie_booking: {
            include: {
              movie_schedule: {
                include: {
                  movie: true,
                  cinema: {
                    include: {
                      cinema_group: {
                        include: {
                          cinema_chain: true,
                        },
                      },
                    },
                  },
                },
              },
              seat: true,
            },
          },
        },
      });

      if (!userProfile) {
        throw new NotFoundException('User not found');
      }

      const response = {
        taiKhoan: userProfile.fullname,
        hoTen: userProfile.fullname,
        email: userProfile.email,
        soDT: userProfile.phone,
        maLoaiNguoiDung: userProfile.user_type,
        loaiNguoiDung: {
          maLoaiNguoiDung: userProfile.user_type,
          tenLoai:
            userProfile.user_type === 'ADMIN' ? 'Quản trị' : 'Khách hàng',
        },
        thongTinDatVe: userProfile.movie_booking.map((booking) => ({
          danhSachGhe: booking.seat
            ? [
                {
                  maHeThongRap:
                    booking.movie_schedule?.cinema?.cinema_group?.cinema_chain
                      ?.id ?? 0,
                  tenHeThongRap:
                    booking.movie_schedule?.cinema?.cinema_group?.cinema_chain
                      ?.chain_name ?? '',
                  maCumRap: booking.movie_schedule?.cinema?.id ?? 0,
                  tenCumRap: booking.movie_schedule?.cinema?.cinema_name ?? '',
                  maRap: booking.seat?.id ?? 0,
                  tenRap: booking.seat?.seat_name ?? '',
                  maGhe: booking.seat?.id ?? 0,
                  tenGhe: booking.seat?.seat_name ?? '',
                },
              ]
            : [],
          maVe: booking.id,
          ngayDat: booking.movie_schedule?.showing_datetime ?? new Date(),
          tenPhim: booking.movie_schedule?.movie?.movie_name ?? '',
          hinhAnh: booking.movie_schedule?.movie?.image ?? '',
          giaVe: booking.movie_schedule?.ticket_price ?? 0,
        })),
      };
      return response;
    } catch (err) {
      console.error('Error getting user profile:', err);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async LayThongTinNguoiDung(email: string): Promise<any> {
    try {
      const userProfile = await this.prisma.user.findFirst({
        where: { email },
        include: {
          movie_booking: {
            include: {
              movie_schedule: {
                include: {
                  movie: true,
                  cinema: {
                    include: {
                      cinema_group: {
                        include: {
                          cinema_chain: true,
                        },
                      },
                    },
                  },
                },
              },
              seat: true,
            },
          },
        },
      });

      if (!userProfile) {
        throw new NotFoundException('User not found');
      }

      const response = {
        taiKhoan: userProfile.fullname,
        hoTen: userProfile.fullname,
        email: userProfile.email,
        soDT: userProfile.phone,
        maLoaiNguoiDung: userProfile.user_type,
        loaiNguoiDung: {
          maLoaiNguoiDung: userProfile.user_type,
          tenLoai:
            userProfile.user_type === 'ADMIN' ? 'Quản trị' : 'Khách hàng',
        },
        thongTinDatVe: userProfile.movie_booking.map((booking) => {
          const movieSchedule = booking.movie_schedule;
          const cinema = movieSchedule?.cinema;
          const cinemaGroup = cinema?.cinema_group;
          const cinemaChain = cinemaGroup?.cinema_chain;

          return {
            danhSachGhe: booking.seat
              ? [
                  {
                    maHeThongRap: cinemaChain?.id ?? 0,
                    tenHeThongRap: cinemaChain?.chain_name ?? '',
                    maCumRap: cinema?.id ?? 0,
                    tenCumRap: cinema?.cinema_name ?? '',
                    maRap: booking.seat?.id ?? 0,
                    tenRap: booking.seat?.seat_name ?? '',
                    maGhe: booking.seat?.id ?? 0,
                    tenGhe: booking.seat?.seat_name ?? '',
                  },
                ]
              : [],
            maVe: booking.id,
            ngayDat: movieSchedule?.showing_datetime ?? new Date(),
            tenPhim: movieSchedule?.movie?.movie_name ?? '',
            hinhAnh: movieSchedule?.movie?.image ?? '',
            giaVe: movieSchedule?.ticket_price ?? 0,
          };
        }),
      };

      return response;
    } catch (err) {
      console.error('Error getting user profile:', err);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async create(body: AddUser): Promise<user> {
    const { hoTen, email, matKhau, soDienThoai, loaiNguoiDung } = body;
    if (!hoTen || !email || !matKhau || !soDienThoai || !loaiNguoiDung) {
      throw new BadRequestException('Missing required fields');
    }

    this.validatePassword(matKhau);

    const exitingEmail = await this.prisma.user.findFirst({
      where: { email },
    });
    if (exitingEmail) {
      throw new ConflictException('Email already exists');
    }

    const exitingPhone = await this.prisma.user.findFirst({
      where: { phone: soDienThoai },
    });
    if (exitingPhone) {
      throw new ConflictException('Phone number already exists');
    }

    const hashedPassword = await bcrypt.hash(matKhau, 5);

    return await this.prisma.user.create({
      data: {
        fullname: hoTen,
        email,
        password: hashedPassword,
        phone: soDienThoai,
        user_type: loaiNguoiDung,
      },
    });
  }

  async update(id: number, body: AddUser): Promise<user> {
    const userId = +id;
    const exitingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!exitingUser) {
      throw new NotFoundException('User not found');
    }

    let updateData: Prisma.userUpdateInput = {};

    if (body.matKhau !== 'string') {
      this.validatePassword(body.matKhau);
      updateData.password = await bcrypt.hash(body.matKhau, 5);
    }

    if (body.hoTen !== 'string') {
      updateData.fullname = body.hoTen;
    }
    if (body.email !== 'string') {
      updateData.email = body.email;
    }
    if (body.soDienThoai !== 'string') {
      updateData.phone = body.soDienThoai;
    }
    if (body.loaiNguoiDung !== 'string') {
      updateData.user_type = body.loaiNguoiDung;
    }

    const updateUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
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
