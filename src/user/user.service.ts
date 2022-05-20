import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileService, FileType } from 'src/file/file.service';
import { UpdateDto } from './dto/update.dto';
import { User, UserDocument } from './schemas/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private fileService: FileService
  ) {}

  async byId(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password').exec();

    if (user) return user;
    throw new NotFoundException('User not found');
  }

  async updateProfile(_id: string, data: UpdateDto, avatar) {
    const user = await this.userModel.findById(_id);
    const isSameUser = await this.userModel.findOne({ email: data.email });
    const avatarPath =
      avatar && this.fileService.createFile(FileType.IMAGE, avatar);

    if (isSameUser && String(_id) !== String(isSameUser._id)) {
      throw new NotFoundException('Email busy');
    }

    if (user) {
      // if (data.password) {
      //   const salt = await genSalt(10);
      //   user.password = await hash(data.password, salt);
      // }
      if (avatar) user.avatar = avatarPath;
      user.email = data.email;
      user.fullname = data.fullname;
      if (data.isSinger || data.isSinger === false)
        user.isSinger = data.isSinger;

      await user.save();
      return user;
    }

    throw new NotFoundException('User not found');
  }

  async getCount() {
    return this.userModel.find().count().exec();
  }

  async getAll(searchTerm?: string): Promise<any> {
    // let options = {};

    // if (searchTerm) {
    //   options = {
    //     $or: [
    //       {
    //         email: new RegExp(searchTerm, 'i'),
    //       },
    //     ],
    //   };
    // }

    return this.userModel.find();
  }

  // async delete(id: string): Promise<User> | null> {
  //   return this.userModel.findByIdAndDelete(id).exec();
  // }
}
