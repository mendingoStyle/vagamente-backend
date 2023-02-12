import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UtilsService } from "modules/utils/utils.service";
import { Commentaries, CommentariesDocument } from "database/schemas/commentaries.schema";
import { CreateCommentary } from "./dto/commentaries.create.dto";
import { GetCommentary } from "./dto/commentaries.get.dto";

@Injectable()
export class CommentariesRepository {
    constructor(
        @InjectModel(Commentaries.name) private commentariesModel: Model<CommentariesDocument>,
        private readonly utils: UtilsService
    ) { }

    async incrementFathers(body: CreateCommentary) {
        if (body.answer_id) {
            let answer = await this.commentariesModel.findByIdAndUpdate({
                _id: body.answer_id
            },
                { $inc: { counter: 1 } },
                { upsert: false }
            )
            while (answer) {
                if (answer.answer_id) {
                    answer = await this.commentariesModel.findByIdAndUpdate({
                        _id: answer.answer_id
                    },
                        { $inc: { counter: 1 } },
                        { upsert: false }
                    )
                }
                else {
                    answer = null
                }
            }
        }
    }

    async create(body: CreateCommentary) {
        if (body._id)
            return await this.commentariesModel.findByIdAndUpdate({
                _id: body._id,
            }, {
                ...body,
                counter: 0
            }, {
                upsert: true,
                new: true
            })
        const commentarieModel = new this.commentariesModel({ ...body, created_at: new Date(this.utils.dateTimeZoneBrasil()) });
        return commentarieModel.save();

    }
    async findAll(dto: GetCommentary) {
        const { page, limit, ...query } = dto
        let r: any = null
        let params = null
        if (!dto.answer_id)
            params = this.utils.applyFilterAggregate({ ...query, answer_id: null })
        else {
            params = this.utils.applyFilterAggregate({ ...query, post_id: null })
        }

        r = this.commentariesModel.aggregate([
            params,
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $lookup: {
                    from: 'commentaries',
                    localField: '_id',
                    foreignField: 'answer_id',
                    as: 'answers',
                },
            },
            {
                "$addFields": {
                    "user.password": {
                        "$cond": [
                            { "$eq": [true, true] },
                            "$$REMOVE",
                            0
                        ]
                    }
                }
            },
            {
                $addFields: { answers_count: { $size: "$answers" } }
            },

            {
                $project: {
                    answers: 0
                }
            },

            { $sort: { _id: -1 } },
            {
                '$facet': {
                    data: [{ $skip: (page - 1) * limit }, { $limit: limit },

                    ], // add projection here wish you re-shape the docs,

                    totalCount: [
                        {
                            $count: 'count'
                        }
                    ]

                }
            }
        ])
        const result = (await r.exec())[0]
        return {
            total: result?.totalCount[0]?.count,
            data: result?.data

        }
    }

}