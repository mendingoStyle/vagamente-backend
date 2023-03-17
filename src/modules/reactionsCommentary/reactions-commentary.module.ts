import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose';
import { ReactionsCommentaryValidator } from './validators/reactions-commentary.validator';
import { ReactionsCommentaryController } from './reactions-commentary.controller';
import { ReactionsCommentaryService } from './reactions-commentary.service';
import { CreateReactionsUseCase } from './useCases/reactions-commentary.create.usecase';
import { GetReactionsUseCase } from './useCases/reactions.get.usecase';
import { Posts, PostsSchema, Reactions } from 'database/schemas/posts.schema';
import { ReactionsCommentaryRepository } from './reactions-commentary.repository';
import { ReactionsCommentary, ReactionsCommentarySchema } from 'database/schemas/reactions_commentary.schema';


@Module({
    controllers: [ReactionsCommentaryController],
    providers: [
        ReactionsCommentaryValidator,
        ReactionsCommentaryRepository,
        ReactionsCommentaryService,
        CreateReactionsUseCase,
        GetReactionsUseCase
    ],
    imports: [
        MongooseModule.forFeature([{ name: ReactionsCommentary.name, schema: ReactionsCommentarySchema }]),
    ],
    exports: [ReactionsCommentaryService],
})
export class ReactionsCommentaryModule { }
