import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() data: AuthDto) {
    return this.AuthService.login(data);
  }

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const oldUser = await this.AuthService.findByEmail(dto.email);
    const oldUserName = await this.AuthService.findByEmail(dto.fullname);
    if (oldUser)
      throw new BadRequestException(
        'User with this email is already in the system'
      );
    if (oldUserName)
      throw new BadRequestException(
        'User with this fullname is already in the system'
      );
    return this.AuthService.register(dto);
  }
}
