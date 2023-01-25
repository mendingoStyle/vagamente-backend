import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Posts, PostsDocument } from "database/schemas/posts.schema";
import mongoose, { Model } from "mongoose";
import { CreatePost } from "./dto/posts.create.dto";
import { GetPost } from "./dto/posts.get.dto";
import { UtilsService } from "modules/utils/utils.service";
import { EditPost } from "./dto/posts.edit.dto";

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
    defaultGet(userId: string) {
        return [
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
                $lookup: {
                    from: 'commentaries',
                    localField: '_id',
                    foreignField: 'post_id',
                    as: 'commentaries',
                },
            },
            {
                $addFields: {
                    like: {
                        $filter: {
                            input: "$reacts",
                            cond: {
                                $and: [
                                    { $eq: ["$$this.type", 'like'] },
                                    { $eq: ["$$this.deleted_at", null] }
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
                                    { $eq: ["$$this.deleted_at", null] }
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
                $addFields: { comentary_count: { $size: "$commentaries" } }
            },
            {
                $addFields: {
                    reacts: {
                        $filter: {
                            input: "$reacts",
                            cond: {
                                $and: [
                                    { $eq: ["$$this.user_id", new mongoose.Types.ObjectId(userId)] },
                                    { $eq: ["$$this.deleted_at", null] },
                                ]

                            }
                        }
                    }
                }
            },
            {
                "$addFields": {
                    "user": {
                        "$cond": [
                            {
                                "$and": [
                                    {
                                        $or: [
                                            { "$eq": ["$isAnonymous", true] },
                                        ]
                                    },
                                    { "$ne": ["$user_id", new mongoose.Types.ObjectId(userId)] }
                                ]
                            },
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
        ]
    }
    async findAll(dto: GetPost, userId: string): Promise<Posts[]> {
        const { page, limit, ...query } = dto
        let r: any = null
        let params = this.utils.applyFilterAggregate(query)
        r = this.postsModel.aggregate([
            params,
            ...this.defaultGet(userId),
            { $project: { 'like': 0, 'dislike': 0, 'commentaries': 0 } },

            { $sort: { _id: -1 } },
            {
                '$facet': {
                    data: [{ $skip: (page - 1) * limit }, { $limit: limit }] // add projection here wish you re-shape the docs
                }
            }
        ])

        return (await r.exec())[0]?.data
    }

    async findHot(dto: GetPost, userId: string): Promise<Posts[]> {
        const { page, limit, ...query } = dto
        let r: any = null
        let params = this.utils.applyFilterAggregate(query)

        r = this.postsModel.aggregate([
            params,
            ...this.defaultGet(userId),
            { $project: { 'like': 0, 'dislike': 0, 'commentaries': 0 } },

            {
                "$addFields": {
                    "likes_commentaries": {
                        $sum: ["$comentary_count", "$likes_count"]
                    }
                }
            },
            { $sort: { likes_commentaries: -1, _id: -1 } },
            {
                '$facet': {
                    data: [{ $skip: (page - 1) * limit }, { $limit: limit }] // add projection here wish you re-shape the docs
                }
            }
        ])

        return (await r.exec())[0]?.data
    }

    async findTrending(dto: GetPost, userId: string): Promise<Posts[]> {
        const { page, limit, ...query } = dto
        let r: any = null
        let params = this.utils.applyFilterAggregate(query)

        r = this.postsModel.aggregate([
            params,
            ...this.defaultGet(userId),
            {
                $addFields: {
                    likes_2h: {
                        $filter: {
                            input: "$like",
                            cond: {
                                $and: [
                                    {
                                        $gte: ["$like.created_at", new Date().setHours(new Date().getHours() - 2)]
                                    },

                                ]
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    commentaries_2h: {
                        $filter: {
                            input: "$commentaries",
                            cond: {
                                $and: [
                                    {
                                        $gte: ["$commentaries.created_at", new Date().setHours(new Date().getHours() - 2)]
                                    },
                                ]
                            }
                        }
                    }
                }
            },
            {
                $addFields: { comentary_2h_count: { $size: "$commentaries_2h" } }
            },
            {
                $addFields: { likes_2h: { $size: "$likes_2h" } }
            },

            { $project: { 'commentaries_2h': 0 } },

            {
                "$addFields": {
                    "likes_commentaries": {
                        $sum: ["$comentary_2h_count", "$likes_2h"]
                    }
                }
            },
            { $project: { 'like': 0, 'dislike': 0, 'commentaries': 0 } },
            { $sort: { likes_commentaries: -1, _id: -1 } },
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
    async edit(dto: EditPost) {
        await this.postsModel.findOneAndUpdate(
            { _id: dto._id, user_id: dto.user_id },
            { ...dto, updated_at: new Date() },
            { upsert: true, new: false });
        return {
            message: 'ok'
        }
    }
}