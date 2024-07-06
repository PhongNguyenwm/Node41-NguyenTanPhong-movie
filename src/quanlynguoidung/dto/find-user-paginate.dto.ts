import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FindUserPaginateDto {
  @ApiPropertyOptional()
  tuKhoa: string;

  @ApiProperty({ default: 1 })
  soTrang: number = 1;

  @ApiProperty({ default: 1 })
  soPhanTuTrenTrang: number = 1;
}
