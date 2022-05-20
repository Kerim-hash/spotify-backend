import { IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  email: string;

  @IsString()
  fullname: string;

  @MinLength(6, { message: 'Password cannot be less than 6 characters' })
  @IsString()
  password: string;
}
