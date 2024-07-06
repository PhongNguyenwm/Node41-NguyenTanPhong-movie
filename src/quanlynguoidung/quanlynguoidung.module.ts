import { Module } from '@nestjs/common';
import { QuanlynguoidungService } from './quanlynguoidung.service';
import { QuanlynguoidungController } from './quanlynguoidung.controller';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  // imports: [UserModule, AuthModule],
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'BI_MAT',
        signOption: { Expires: '1h' },
      }),
    }),
  ],
  controllers: [QuanlynguoidungController],
  providers: [QuanlynguoidungService, UserService],
})
export class QuanlynguoidungModule {}
