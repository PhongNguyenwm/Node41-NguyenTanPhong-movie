import { Injectable, NotFoundException } from '@nestjs/common';
import {
  cinema_group,
  PrismaClient,
  cinema_chain,
  movie_schedule,
  movie,
} from '@prisma/client';
import { CinemaChainResponseDto } from './dto/cinema-chain-responce.dtc';
import { CinemaGroupDto } from './dto/cinema-group.dto';

@Injectable()
export class CinemaManagementService {
  prisma = new PrismaClient();

  async findAll(maHeThongRap?: string): Promise<CinemaChainResponseDto[]> {
    let data: cinema_chain[];

    if (maHeThongRap) {
      data = await this.prisma.cinema_chain.findMany({
        where: { chain_name: maHeThongRap },
      });
    } else {
      data = await this.prisma.cinema_chain.findMany();
    }

    return data.map((cinema) => ({
      maHeThongRap: this.mapChainName(cinema.chain_name),
      tenHeThongRap: this.getReadableName(cinema.chain_name),
      biDanh: this.getAlias(cinema.chain_name),
      logo: cinema.logo,
    }));
  }

  async findAllCinemaGroups(maCumRap?: string): Promise<CinemaGroupDto[]> {
    let data: cinema_group[];

    if (maCumRap) {
      // Mapping maCumRap to cinema_chain_id
      const cinemaChainId = this.mapMaCumRapToCinemaChainId(maCumRap);
      if (cinemaChainId) {
        data = await this.prisma.cinema_group.findMany({
          where: { cinema_chain_id: cinemaChainId },
        });
      } else {
        data = [];
      }
    } else {
      data = await this.prisma.cinema_group.findMany();
    }

    return data.map((group) => ({
      maCumRap: this.mapCinemaChainIdToMaCumRap(group.cinema_chain_id),
      tenCumRap: group.group_name,
      diaChi: group.address,
    }));
  }

  async findOne(id: number): Promise<movie_schedule> {
    try {
      const data: movie_schedule | null =
        await this.prisma.movie_schedule.findFirst({
          where: { id },
        });
      if (!data) {
        throw new NotFoundException('movie_schedule not found');
      }
      return data;
    } catch (error) {
      console.error('Error fetching paginated movies:', error);
      throw new Error('Unable to fetch paginated movies');
    }
  }

  async findOneMovie(id: number): Promise<movie> {
    let data: movie | null = await this.prisma.movie.findFirst({
      where: { id: id },
    });
    if (!data) {
      throw new NotFoundException('Movie not found');
    }
    return data;
  }

  private mapChainName(chain_name: string | null): string {
    if (!chain_name) return '';
    const mapping = {
      CGV_MEGA: 'CGV_MEGA',
      CineStar: 'CineStar',
      LotteCinema: 'LotteCinema',
      'BHD STAR': 'BHDStar',
    };
    return mapping[chain_name] || chain_name;
  }

  private getReadableName(chain_name: string | null): string {
    if (!chain_name) return '';
    const readableNames = {
      CGV_MEGA: 'cgv',
      CineStar: 'CineStar',
      LotteCinema: 'Lotte Cinema',
      'BHD STAR': 'BHD Star Cineplex',
    };
    return readableNames[chain_name] || chain_name;
  }

  private getAlias(chain_name: string | null): string {
    if (!chain_name) return '';
    const aliases = {
      CGV_MEGA: 'cgv',
      CineStar: 'cinestar',
      LotteCinema: 'lotte-cinema',
      'BHD STAR': 'bhd-star-cineplex',
    };
    return aliases[chain_name] || chain_name;
  }

  private mapCinemaChainIdToMaCumRap(cinema_chain_id: number | null): string {
    if (!cinema_chain_id) return '';

    // Define the mapping of cinema_chain_id
    const maCumRapMapping: { [key: number]: string } = {
      2: 'CGV_MEGA',
      6: 'BHD_STAR',
    };

    return maCumRapMapping[cinema_chain_id] || '';
  }

  private mapMaCumRapToCinemaChainId(maCumRap: string): number | null {
    // Define the reverse mapping of maCumRap to cinema_chain_id
    const cinemaChainIdMapping: { [key: string]: number } = {
      CGV_MEGA: 2,
      BHD_STAR: 6,
    };

    return cinemaChainIdMapping[maCumRap] || null;
  }
}
