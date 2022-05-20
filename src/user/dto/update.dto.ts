import { IsEmail, IsString } from 'class-validator';

export class UpdateDto {
  @IsEmail()
  email: string;

  @IsString()
  fullname: string;

  // avatar?: any;

  isSinger?: boolean;
}
