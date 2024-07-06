import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateMovieDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  tenPhim?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  moTa?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  trailer?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  hinhAnh?: string;

  @ApiProperty({ type: Date })
  @IsOptional()
  @IsDateString()
  ngayChieu?: string;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  danhGia?: number;

  @ApiProperty({ type: Boolean, required: false })
  @IsOptional()
  @IsBoolean()
  hot?: boolean;

  @ApiProperty({ type: Boolean, required: false })
  @IsOptional()
  @IsBoolean()
  dangChieu?: boolean;

  @ApiProperty({ type: Boolean, required: false })
  @IsOptional()
  @IsBoolean()
  sapChieu?: boolean;
}
