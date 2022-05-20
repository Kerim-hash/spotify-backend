import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Track } from 'src/track/schemas/track.schemas';

export type AlbumDocument = Album & Document;

@Schema()
export class Album {
  @Prop()
  name: string;
  @Prop()
  artist: string;

  @Prop()
  photo: string;

  @Prop()
  tracks: Track[];
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
