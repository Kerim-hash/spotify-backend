import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from './schemas/track.schemas';
import { Comment, CommentDocument } from './schemas/comment.schemas';
import { CreateTrackDto } from './dto/create-track.dto';
import { CreateCommentDto } from './dto/create-comment';
import { FileService, FileType } from 'src/file/file.service';
import { Album, AlbumDocument } from 'src/album/schemas/album.schemas';

type NewType = Promise<Track>;

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private fileService: FileService
  ) {}

  async getAll(count = 10, offset = 0): Promise<Track[]> {
    const tracks = await this.trackModel
      .find()
      .skip(Number(offset))
      .limit(Number(count));
    return tracks;
  }

  async search(query: string): Promise<Track[]> {
    const tracks = await this.trackModel.find({
      name: { $regex: new RegExp(query, 'i') },
    });
    return tracks;
  }

  async create(dto: CreateTrackDto, audio): NewType {
    const audioPath = await this.fileService.createFile(FileType.AUDIO, audio);
    const album = await this.albumModel.findById(dto.albumId);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    const track = await this.trackModel.create({
      ...dto,
      listens: 0,
      audio: audioPath,
      picture: album.photo,
      album: album._id,
    });
    album.tracks.push(track);
    await album.save();
    return track;
  }

  async getOne(id: ObjectId): NewType {
    const track = await this.trackModel
      .findById(id)
      .populate('comments')
      .sort({ createdAt: '-1' })
      .exec();
    return track;
  }

  async delete(id: ObjectId): Promise<ObjectId> {
    const track = await this.trackModel.findByIdAndDelete(id);
    return track._id;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async createComment(dto: CreateCommentDto): Promise<Comment> {
    const track = await this.trackModel.findById(dto.trackId);
    const comment = await this.commentModel.create({ ...dto });
    track.comments.push(comment._id);
    await track.save();
    return comment;
  }

  async listen(id: ObjectId) {
    // return this.trackModel
    //   .findOneAndUpdate({ id }, { $inc: { listens: 1 } })
    //   .exec();
    const track = await this.trackModel.findById(id);
    track.listens += 1;
    track.save();
  }
}
