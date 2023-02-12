import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Posts, PostsDocument, Reactions } from "database/schemas/posts.schema";
import { ReactionsDocument } from "database/schemas/reactions.schema";
import { Model } from "mongoose";
import { CreateReaction } from "./dto/reactions.create.dto";
import { UtilsService } from "modules/utils/utils.service";
import { GetReactions } from "./dto/reactions.get.dto";

@Injectable()
export class ReactionsRepository {
    constructor(
        @InjectModel(Reactions.name) private reactionsModel: Model<ReactionsDocument>,
        @InjectModel(Posts.name) private postsModel: Model<PostsDocument>,

        private readonly utils: UtilsService
    ) { }

    async create(react: CreateReaction, user_id: string) {
        return await this.reactionsModel.findOneAndUpdate(
            { post_id: react.post_id, user_id: user_id },
            { ...react, created_at: new Date(this.utils.dateTimeZoneBrasil()), updated_at: new Date(this.utils.dateTimeZoneBrasil()) },
            { upsert: true, new: true });

    }
    async findAll(dto: GetReactions) {
        const { limit, page, ...query } = dto
        let r: any = this.reactionsModel
            .find()
        r = this.utils.applyFilter(query, r)
        return r.skip((dto.page - 1) * dto.limit)
            .sort({ _id: 'desc' })
            .limit(dto.limit)
            .exec()
    }

}