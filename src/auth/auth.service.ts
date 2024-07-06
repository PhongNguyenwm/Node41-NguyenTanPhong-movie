import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, user } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  prisma = new PrismaClient();
  constructor(private jwtService: JwtService) {}

  async signup(body: any): Promise<user> {
    const { fullname, email, phone, password } = body;
    if (!fullname || !email || !password || !phone) {
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
        phone,
        password: hashedPassword,
        user_type: 'user',
      },
    });
    return newUser;
  }

  async login(body: any) {
    const { email, password } = body;
    if (!email || !password) {
      throw new BadRequestException('Missing required fields');
    }

    const user = await this.prisma.user.findFirst({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('Invalid email');
    }
    if (!(await bcrypt.compare(password, user.password))) {
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
