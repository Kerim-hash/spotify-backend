import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserDec } from './decorators/user.decorator';
import { UserService } from './user.service';
import { UpdateDto } from './dto/update.dto';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  async getProfile(@UserDec('_id') _id: string) {
    return this.userService.byId(_id);
  }

  @Get('count')
  @Auth('admin')
  async getCountUsers() {
    return this.userService.getCount();
  }

  @Get()
  async getUsers(@Query('searchTerm') searchTerm?: string) {
    return this.userService.getAll(searchTerm);
  }

  @Get(':id')
  @Auth('admin')
  async getUser(@Param('id', IdValidationPipe) id: string) {
    return this.userService.byId(id);
  }

  @UsePipes(new ValidationPipe())
  @Put('/profile/update')
  @HttpCode(200)
  @Auth()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'avatar', maxCount: 1 }]))
  async updateUser(
    @UploadedFiles() files,
    @UserDec('_id') _id: string,
    @Body() data: UpdateDto
  ) {
    const { avatar } = files;
    return this.userService.updateProfile(_id, data, avatar && avatar[0]);
  }

  // @Delete(':id')
  // @Auth('admin')
  // async delete(@Param('id', IdValidationPipe) id: string) {
  //   const deletedDoc = await this.userService.delete(id);
  //   if (!deletedDoc) throw new NotFoundException('Movie not found');
  // }
}
