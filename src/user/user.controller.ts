import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { user } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create-user')
  create(@Body() body: any) {
    return this.userService.create(body);
  }

  @Get('/get-user')
  findAll(): Promise<user[]> {
    return this.userService.findAll();
  }

  @Get('/get-user-pagination')
  async getPaginateUser(
    @Query('page') page: number = 1,
  ): Promise<{ data: user[]; total: number; page: number }> {
    return this.userService.getPaginateUser(page);
  }

  @Get('/detail-user/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get('/search')
  findUser(
    @Query('id') id?: number,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('phone') phone?: string,
  ) {
    return this.userService.findUser(id, name, email, phone);
  }

  @Get('/search-paginate')
  async searchPaginateUser(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('id') id?: number,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('phone') phone?: string,
  ): Promise<{ data: user[]; total: number; page: number; limit: number }> {
    return this.userService.findPaginateUser(
      page,
      limit,
      id,
      name,
      email,
      phone,
    );
  }

  @Patch('/update-user/:id')
  update(@Param('id') id: string, @Body() body: Partial<user>) {
    return this.userService.update(+id, body);
  }

  @Delete('/delete-user/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
