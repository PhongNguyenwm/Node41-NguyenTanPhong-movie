import { Module } from '@nestjs/common';
import { CinemaManagementService } from './cinema-management.service';
import { CinemaManagementController } from './cinema-management.controller';

@Module({
  controllers: [CinemaManagementController],
  providers: [CinemaManagementService],
})
export class CinemaManagementModule {}
