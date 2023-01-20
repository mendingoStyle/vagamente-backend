import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose';
import { Posts, PostsSchema } from 'database/schemas/posts.schema';
import { PostsController } from './posts.controller';
import { PostsValidator } from './validators/posts.validator';
import { GetPostUseCase } from './useCases/posts.get.usecase';
import { CreatePostUseCase } from './useCases/posts.create.usecase';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';
import { UploadModule } from 'modules/upload/upload.module';
import { TagsModule } from 'modules/tags/tags.module';
import { TokenModule } from 'modules/token/tokenController.module';

@Module({
    controllers: [PostsController],
    providers: [
        PostsValidator,
        GetPostUseCase,
        CreatePostUseCase,
        PostsRepository,
        PostsService,
    ],
    imports: [
        MongooseModule.forFeature([{ name: Posts.name, schema: PostsSchema }]),
        UploadModule,
        TagsModule,
        TokenModule
    ],
    exports: [PostsService],
})
export class PostsModule { }
