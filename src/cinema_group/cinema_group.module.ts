import { Module } from '@nestjs/common';
import { CinemaGroupService } from './cinema_group.service';
import { CinemaGroupController } from './cinema_group.controller';

@Module({
  controllers: [CinemaGroupController],
  providers: [CinemaGroupService],
})
export class CinemaGroupModule {}
