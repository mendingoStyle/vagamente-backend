import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Posts, PostsDocument, Reactions } from "database/schemas/posts.schema";
import mongoose, { Model } from "mongoose";
import { CreatePost } from "./dto/posts.create.dto";
import { GetPost } from "./dto/posts.get.dto";
import { UtilsService } from "modules/utils/utils.service";
import { pipeline } from "stream";

@Injectable()
export class PostsRepository {
    constructor(
        @InjectModel(Posts.name) private postsModel: Model<PostsDocument>,
        private readonly utils: UtilsService
    ) { }
    create(post: CreatePost) {
        const postModel = new this.postsModel(post);
        return postModel.save();
    }
    async findAll(dto: GetPost, userId: string): Promise<Posts[]> {
        const { page, limit, ...query } = dto
        let r: any = null
        let params = this.utils.applyFilterAggregate(query)

        r = this.postsModel.aggregate([
            params,
            {
                $lookup: {
                    from: 'reactions',
                    localField: '_id',
                    foreignField: 'post_id',
                    as: 'reacts',
                },
            },


            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user',
                },
            },

            {
                $addFields: {
                    like: {
                        $filter: {
                            input: "$reacts",
                            cond: { $eq: ["$$this.type", 'like'] }
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
                            cond: { $eq: ["$$this.type", 'dislike'] }
                        }
                    }
                }
            },
            {
                $addFields: { dislike_count: { $size: "$dislike" } }
            },
            {
                $addFields: {
                    reacts: {
                        $filter: {
                            input: "$reacts",
                            cond: { $eq: ["$$this.user_id", new mongoose.Types.ObjectId(userId)] }
                        }
                    }
                }
            },
            { $project: { 'like': 0, 'dislike': 0 } },

            {
                "$addFields": {
                    "user": {
                        "$cond": [
                            { "$eq": ["$isAnonymous", true] },
                            "$$REMOVE",
                            "$user"
                        ]
                    }
                }
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
            { $sort: { _id: -1 } },
            {
                '$facet': {
                    data: [{ $skip: (page - 1) * limit }, { $limit: limit }] // add projection here wish you re-shape the docs
                }
            }
        ])

        return (await r.exec())[0]?.data
    }

    async findCategories() {
        const r = await this.postsModel.aggregate([
            { $unwind: "$tags" },
            { "$group": { _id: "$tags", count: { $sum: 1 } } },
            { $sort: { "count": -1 } },
            {
                $group: {
                    "_id": null, "tags_details": {
                        $push: {
                            "tags": "$_id",
                            "count": "$count"
                        }
                    }
                }
            },
            { $project: { "_id": 0, "tags_details": 1 } },
        ])

        return r[0].tags_details
    }
}