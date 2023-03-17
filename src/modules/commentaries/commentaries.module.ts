import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose';
import { Commentaries, CommentariesSchema } from 'database/schemas/commentaries.schema';
import { CommentariesService } from './commentaries.service';
import { CommentariesController } from './commentaries.controller';
import { CommentariesValidator } from './validators/commentaries.validator';
import { CommentariesRepository } from './commentaries.repository';
import { GetCommentariesUseCase } from './useCases/commentaries.get.usecase';
import { CreateCommentariesUseCase } from './useCases/commentaries.create.usecase';
import { TokenModule } from 'modules/token/tokenController.module';

@Module({
    controllers: [CommentariesController],
    providers: [
        CommentariesValidator,
        GetCommentariesUseCase,
        CreateCommentariesUseCase,
        CommentariesRepository,
        CommentariesService,
    ],
    imports: [
        MongooseModule.forFeature([{ name: Commentaries.name, schema: CommentariesSchema }]),
        TokenModule
    ],
    exports: [CommentariesService],
})
export class CommentariesModule { }
