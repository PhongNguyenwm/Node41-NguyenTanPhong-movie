import { ApiProperty } from '@nestjs/swagger';

export class CreateCinemaScheduleDto {
  @ApiProperty()
  maPhim: number;

  @ApiProperty()
  maRap: number;

  @ApiProperty()
  ngayChieuGioChieu: Date;

  @ApiProperty()
  giaVe: number;
}
