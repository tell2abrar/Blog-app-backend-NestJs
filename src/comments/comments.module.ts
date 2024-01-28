import { Module } from '@nestjs/common';
import { Comment } from './entities/comments.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  providers: [CommentsResolver, CommentsService],
})
export class CommentsModule {}
