import {
  Controller,
  Get,
  UseGuards,
  Body,
  Post,
  Headers,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { QuanlynguoidungService } from './quanlynguoidung.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUserTypesResponseDto } from './dto/get-user-types-response.dto';
import { UserTypeDto } from './dto/user-type.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from './dto/user.dto';
import {
  Api200Response,
  Api500Response,
} from 'src/decorators/api-common-responses.decorator';
import { LoginDto } from './dto/login.dto';
import { user } from '@prisma/client';
import { FindUserDto } from './dto/find-user.dto';
import { FindUserPaginateDto } from './dto/find-user-paginate.dto';
import { AddUser } from './dto/add-user.dto';

@ApiTags('QuanLyNguoiDung')
@Controller('/api/QuanLyNguoiDung')
export class QuanlynguoidungController {
  constructor(
    private readonly quanlynguoidungService: QuanlynguoidungService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('LayDanhSachLoaiNguoiDung')
  @ApiResponse({
    status: 200,
    description: 'Xử lý thành công!',
    type: GetUserTypesResponseDto,
  })
  getUserTypes(): GetUserTypesResponseDto {
    const content: UserTypeDto[] = this.quanlynguoidungService.getUserTypes();

    return {
      statusCode: 200,
      message: 'Success',
      content,
      dateTime: new Date().toISOString(),
      messageConstants: null,
    };
  }

  @Post('DangKi')
  @Api200Response()
  @Api500Response()
  signup(@Body() body: UserDto) {
    return this.quanlynguoidungService.signup(body);
  }

  @Post('DangNhap')
  login(@Body() body: LoginDto, @Headers('token') header) {
    return this.quanlynguoidungService.login(body);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('LayDanhSachNguoiDung')
  @Api200Response()
  @Api500Response()
  findAll(): Promise<user[]> {
    return this.quanlynguoidungService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/LayDanhSachNguoiDungPhanTrang')
  @Api200Response()
  @Api500Response()
  async getPaginateUser(
    @Query('page') page: number = 1,
  ): Promise<{ data: user[]; total: number; page: number }> {
    return this.quanlynguoidungService.getPaginateUser(page);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('TimKiemNguoiDung')
  @Api200Response()
  @Api500Response()
  async findUser(@Query() query: FindUserDto) {
    return this.quanlynguoidungService.findUser(query.tuKhoa);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('TimKiemNguoiDungPhanTrang')
  @Api200Response()
  @Api500Response()
  async searchPaginateUser(
    @Query('tuKhoa') tuKhoa: string,
    @Query('soTrang', new DefaultValuePipe(1), ParseIntPipe) soTrang: number,
    @Query('soPhanTuTrenTrang', new DefaultValuePipe(1), ParseIntPipe)
    soPhanTuTrenTrang: number,
  ) {
    return this.quanlynguoidungService.findPaginateUser(
      tuKhoa,
      soTrang,
      soPhanTuTrenTrang,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('ThongTinTaiKhoan')
  @Api200Response()
  async getUserProfile(@Headers('token') token: string) {
    return this.quanlynguoidungService.getUserProfile(token);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('LayThongTinNguoiDung')
  @Api200Response()
  async LayThongTinNguoiDung(@Query('email') email: string) {
    return this.quanlynguoidungService.LayThongTinNguoiDung(email);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('ThemNguoiDung')
  @Api200Response()
  create(@Body() body: AddUser) {
    return this.quanlynguoidungService.create(body);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('CapNhatThongTinNguoiDung/:id')
  @Api200Response()
  update(@Param('id') id: string, @Body() body: AddUser) {
    return this.quanlynguoidungService.update(+id, body);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('XoaNguoiDung/:id')
  @Api200Response()
  remove(@Param('id') id: string) {
    return this.quanlynguoidungService.remove(+id);
  }
}
