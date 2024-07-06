import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindUserDto {
  @ApiPropertyOptional()
  tuKhoa: string;
}
