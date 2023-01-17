import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose';
import { UploadModule } from 'modules/upload/upload.module';
import { TagsController } from './tags.controller';
import { Tags, TagsSchema } from 'database/schemas/tags.schema';
import { TagsValidator } from './validator/tags.validator';
import { TagsRepository } from './tags.repository';
import { TagsService } from './tags.service';
import { CreateTagUseCase } from './useCases/tags.create.usecase';
import { GetTagsUseCase } from './useCases/tags.get.usecase';

@Module({
    controllers: [TagsController],
    providers: [
        TagsValidator,
        TagsRepository,
        TagsService,
        CreateTagUseCase,
        GetTagsUseCase
    ],
    imports: [
        MongooseModule.forFeature([{ name: Tags.name, schema: TagsSchema }]),
        UploadModule
    ],
    exports: [TagsService],
})
export class TagsModule { }
