import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { FileService, FileType } from 'src/file/file.service';
import { Album, AlbumDocument } from './schemas/album.schemas';
import { CreateAlbumDto } from './dto/create-album';
import { User, UserDocument } from 'src/user/schemas/user.model';

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private fileService: FileService
  ) {}

  async create(dto: CreateAlbumDto, photo): Promise<any> {
    const photoPath = this.fileService.createFile(FileType.IMAGE, photo);
    const user = await this.userModel.findById(dto.userId);
    const album = await this.albumModel.create({
      ...dto,
      photo: photoPath,
    });
    user.albums.push(album);
    await user.save();
    return album;
  }

  async getAll(): Promise<any> {
    const albums = this.albumModel.find();
    return albums;
  }

  async getOne(id: ObjectId): Promise<any> {
    const album = await this.albumModel.findById(id);
    return album;
  }
}
