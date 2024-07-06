import { Module } from '@nestjs/common';
import { MovieManagementService } from './movie_management.service';
import { MovieManagementController } from './movie_management.controller';

@Module({
  controllers: [MovieManagementController],
  providers: [MovieManagementService],
})
export class MovieManagementModule {}
