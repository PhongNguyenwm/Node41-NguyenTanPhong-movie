import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  hoTen: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  matKhau: string;

  @ApiProperty()
  soDienThoai: string;
}
