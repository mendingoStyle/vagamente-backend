import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Posts, PostsDocument } from "database/schemas/posts.schema";
import { Tags, TagsDocument } from "database/schemas/tags.schema";
import { Model } from "mongoose";
import { GetTag } from "./dto/tags.get.dto";
import { CreateTags } from "./dto/tags.create.dto";
import { UtilsService } from "modules/utils/utils.service";


@Injectable()
export class TagsRepository {
    constructor(
        @InjectModel(Tags.name) private tagsModel: Model<TagsDocument>,
        private readonly utils: UtilsService
        ) { }
    create(tag: CreateTags) {
        return this.tagsModel.findOneAndUpdate(
            { title: tag.title },
            { ...tag, created_at: new Date(this.utils.dateTimeZoneBrasil()), updated_at: new Date(this.utils.dateTimeZoneBrasil()) },
            { upsert: true, useFindAndModify: false });
    }
    async findAll(dto: GetTag) {
        return await this.tagsModel
            .find()
            .skip((dto.page - 1) * dto.limit)
            .sort({ _id: 'desc' })
            .limit(dto.limit)
            .exec()
    }
    async upsert(tag: CreateTags) {

    }
}