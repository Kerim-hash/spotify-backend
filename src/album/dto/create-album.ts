import { IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateAlbumDto {
  @IsString()
  name: string;

  @IsString()
  artist: string;

  userId?: ObjectId;
}
