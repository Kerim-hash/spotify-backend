import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { FileService, FileType } from 'src/file/file.service';
import { Track, TrackDocument } from 'src/track/schemas/track.schemas';
import { Album, AlbumDocument } from './schemas/album.schemas';
import { CreateAlbumDto } from './dto/create-album';

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    private fileService: FileService
  ) {}

  async create(dto: CreateAlbumDto, photo): Promise<any> {
    const photoPath = this.fileService.createFile(FileType.IMAGE, photo);
    const album = await this.albumModel.create({
      ...dto,
      photo: photoPath,
    });
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
