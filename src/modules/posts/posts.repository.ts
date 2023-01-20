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
            { $project: { 'like': 0, 'dislike': 0 } }


        ])
        //r =  this.utils.applyFilter(query, r)
        return r.skip((page - 1) * limit)
            .sort({ _id: 'desc' })
            .limit(limit)
            .exec()
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