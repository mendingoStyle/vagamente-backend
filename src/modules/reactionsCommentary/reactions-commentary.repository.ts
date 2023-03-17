import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateReactionCommentary } from "./dto/reactions-commentary.create.dto";
import { UtilsService } from "modules/utils/utils.service";
import { GetReactionsCommentary } from "./dto/reactions.get.dto";
import { ReactionsCommentary, ReactionsCommentaryDocument } from "database/schemas/reactions_commentary.schema";

@Injectable()
export class ReactionsCommentaryRepository {
    constructor(
        @InjectModel(ReactionsCommentary.name) private reactionsModel: Model<ReactionsCommentaryDocument>,
        private readonly utils: UtilsService
    ) { }

    async create(react: CreateReactionCommentary, user_id: string) {
        return await this.reactionsModel.findOneAndUpdate(
            { commentary_id: react.commentary_id, user_id: user_id },
            { ...react, created_at: new Date(this.utils.dateTimeZoneBrasil()), updated_at: new Date(this.utils.dateTimeZoneBrasil()) },
            { upsert: true, new: true });

    }
    async findAll(dto: GetReactionsCommentary) {
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