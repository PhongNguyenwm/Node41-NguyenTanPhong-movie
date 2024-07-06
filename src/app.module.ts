import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MovieModule } from './movie/movie.module';
import { BannerModule } from './banner/banner.module';
import { CinemaChainModule } from './cinema_chain/cinema_chain.module';
import { CinemaGroupModule } from './cinema_group/cinema_group.module';
import { CinemaModule } from './cinema/cinema.module';
import { SeatModule } from './seat/seat.module';
import { MovieScheduleModule } from './movie_schedule/movie_schedule.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

import { QuanlydatveModule } from './quanlydatve/quanlydatve.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { QuanlynguoidungModule } from './quanlynguoidung/quanlynguoidung.module';
import { MovieManagementModule } from './movie_management/movie_management.module';
import { CinemaManagementModule } from './cinema-management/cinema-management.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // MovieModule,
    // BannerModule,
    // CinemaChainModule,
    // CinemaGroupModule,
    // CinemaModule,
    // SeatModule,
    // MovieScheduleModule,
    // UserModule,
    // AuthModule,

    QuanlydatveModule,

    QuanlynguoidungModule,

    MovieManagementModule,

    CinemaManagementModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
