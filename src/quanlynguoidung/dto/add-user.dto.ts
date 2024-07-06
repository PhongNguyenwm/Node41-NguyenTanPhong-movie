import { ApiProperty } from '@nestjs/swagger';

export class AddUser {
  @ApiProperty({ required: false })
  hoTen: string;

  @ApiProperty({ required: false })
  email: string;

  @ApiProperty({ required: false })
  soDienThoai: string;

  @ApiProperty({ required: false })
  matKhau: string;

  @ApiProperty({ required: false })
  loaiNguoiDung: string;
}
