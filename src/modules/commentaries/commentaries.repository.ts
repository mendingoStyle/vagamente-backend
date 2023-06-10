import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, ObjectId } from "mongoose";
import { UtilsService } from "modules/utils/utils.service";
import { Commentaries, CommentariesDocument } from "database/schemas/commentaries.schema";
import { CreateCommentary } from "./dto/commentaries.create.dto";
import { GetCommentary } from "./dto/commentaries.get.dto";
import { ReactionsCommentary } from "database/schemas/reactions_commentary.schema";
import { Posts } from "database/schemas/posts.schema";

@Injectable()
export class CommentariesRepository {
    constructor(
        @InjectModel(Commentaries.name) private commentariesModel: Model<CommentariesDocument>,
        private readonly utils: UtilsService
    ) { }

    async incrementFathers(body: CreateCommentary): Promise<Commentaries> {
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
                    return answer
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
                updated_at: new Date(this.utils.dateTimeZoneBrasil()),

            }, {
                upsert: true,
                new: true
            })
        const commentarieModel = new this.commentariesModel({
            ...body,
            created_at: new Date(this.utils.dateTimeZoneBrasil()),
            counter: 0
        });
        return commentarieModel.save();

    }
    async findAll(dto: GetCommentary, userId: string) {
        const { page, limit, ...query } = dto
        let r: any = null
        let params = null
        if (!dto.answer_id)
            params = this.utils.applyFilterAggregate({ ...query, answer_id: null, deleted_at: null })
        else {
            params = this.utils.applyFilterAggregate({ ...query, post_id: null, deleted_at: null })
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
                $lookup: {
                    from: 'reactionscommentaries',
                    localField: '_id',
                    foreignField: 'commentary_id',
                    as: 'reacts',
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
                "$addFields": {
                    "user": {
                        "$cond": [
                            {
                                $or: [
                                    { "$eq": [{ "$type": "$deleted_at" }, "missing"] },
                                    { "$eq": [{ "$type": "$deleted_at" }, "null"] },
                                ]
                            },
                            "$user",
                            "$$REMOVE",
                        ]
                    },
                    "commentary": {
                        "$cond": [
                            {
                                $or: [
                                    { "$eq": [{ "$type": "$deleted_at" }, "missing"] },
                                    { "$eq": [{ "$type": "$deleted_at" }, "null"] },
                                ]
                            },
                            "$commentary",
                            "Comentário Excluído",

                        ]
                    },
                }
            },
            {
                $addFields: {
                    like: {
                        $filter: {
                            input: "$reacts",
                            cond: {
                                $and: [
                                    { $eq: ["$$this.type", 'like'] },
                                    {
                                        $or: [
                                            { "$eq": [{ "$type": "$$this.deleted_at" }, "missing"] },
                                            { "$eq": [{ "$type": "$$this.deleted_at" }, "null"] },
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $addFields: { likes_count: { $size: "$like" } }
            },
            {
                $addFields: {
                    dislike: {
                        $filter: {
                            input: "$reacts",
                            cond: {
                                $and: [
                                    { $eq: ["$$this.type", 'dislike'] },
                                    {
                                        $or: [
                                            { "$eq": [{ "$type": "$$this.deleted_at" }, "missing"] },
                                            { "$eq": [{ "$type": "$$this.deleted_at" }, "null"] },
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $addFields: { dislike_count: { $size: "$dislike" } }
            },
            {
                $addFields: { answers_count: { $size: "$answers" } }
            },

            {
                $addFields: {
                    reacts: {
                        $filter: {
                            input: "$reacts",
                            cond: {
                                $or: [
                                    {
                                        $and: [
                                            { $eq: ["$$this.user_id", new mongoose.Types.ObjectId(userId)] },
                                            { $eq: ["$$this.deleted_at", null] },

                                        ],
                                    },
                                    {
                                        $and: [
                                            { $eq: ["$$this.user_id", new mongoose.Types.ObjectId(userId)] },
                                            { "$eq": [{ "$type": "$deleted_at" }, "missing"] }
                                        ]
                                    }
                                ]

                            }
                        }
                    }
                }
            },
            {
                $project: {
                    answers: 0,
                    like: 0,
                    dislike: 0,
                }
            },

            { $sort: { _id: -1 } },
            {
                '$facet': {
                    data: [{ $skip: (page - 1) * limit }, { $limit: limit },
                    ],
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
    async findByid(id: ObjectId | string): Promise<Commentaries> {
        return this.commentariesModel.findById(id)
    }

}