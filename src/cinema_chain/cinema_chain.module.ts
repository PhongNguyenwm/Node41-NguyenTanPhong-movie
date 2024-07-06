import { Module } from '@nestjs/common';
import { CinemaChainService } from './cinema_chain.service';
import { CinemaChainController } from './cinema_chain.controller';

@Module({
  controllers: [CinemaChainController],
  providers: [CinemaChainService],
})
export class CinemaChainModule {}
