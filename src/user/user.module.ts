import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schemas/user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { Track, TrackSchema } from 'src/track/schemas/track.schemas';
import { FileService } from 'src/file/file.service';

@Module({
  controllers: [UserController],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }]),
  ],
  providers: [UserService, FileService],
  exports: [UserService],
})
export class UserModule {}
