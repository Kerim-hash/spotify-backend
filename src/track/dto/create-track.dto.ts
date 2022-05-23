import { IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateTrackDto {
  @IsString()
  name: string;

  @IsString()
  artist: string;

  @IsString()
  text: string;

  albumId?: ObjectId;
}
