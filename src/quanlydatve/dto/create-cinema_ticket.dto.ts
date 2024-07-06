import { ApiProperty } from '@nestjs/swagger';

export class CreateCinemaTicketDto {
  @ApiProperty()
  maKhachHang: number;

  @ApiProperty()
  maLichChieu: number;

  @ApiProperty()
  maGhe: number;
}
