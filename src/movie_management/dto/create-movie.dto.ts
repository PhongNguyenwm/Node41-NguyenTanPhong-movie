import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ type: String })
  @IsString()
  tenPhim: string;

  @ApiProperty({ type: String })
  @IsString()
  moTa: string;

  @ApiProperty({ type: String })
  @IsString()
  trailer: string;

  @ApiProperty({ type: String })
  @IsString()
  hinhAnh: string;

  @ApiProperty({ type: Date })
  @IsDateString()
  ngayChieu: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  danhGia: number;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  hot: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  dangChieu: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  sapChieu: boolean;
}
