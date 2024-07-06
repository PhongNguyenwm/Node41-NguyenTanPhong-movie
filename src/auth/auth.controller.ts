import { Body, Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signup(@Body() body: any) {
    return this.authService.signup(body);
  }

  @Post('/login')
  login(@Body() body: any, @Headers('token') header) {
    return this.authService.login(body);
  }
}
