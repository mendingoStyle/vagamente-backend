import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Posts, PostsDocument } from "database/schemas/posts.schema";
import mongoose, { Model, ObjectId } from "mongoose";
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
                $addFields: { comentary_count_aux: { $size: "$commentaries" } }
            },
            {
                $addFields: { counter_sons: { $sum: "$commentaries.counter" } }
            },
            {
                $addFields: { comentary_count: { $sum: ["$counter_sons", "$comentary_count_aux"] } }
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
                    },
                    "user_id": {
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
                            "$user_id"
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
            {
                $lookup: {
                    from: 'usersbadges',
                    localField: 'user_id',
                    foreignField: 'user_id',
                    as: 'usersBadges',
                },

            },
            {
                $lookup: {
                    from: 'badges',
                    localField: 'usersBadges.badge_id',
                    foreignField: '_id',
                    as: 'badge',
                },
            },
            { $project: { 'usersBadges': 0, counter_sons: 0, comentary_count_aux: 0 } },
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
        const dateFilterCommentaryReactions = new Date(new Date(this.utils.dateTimeZoneBrasil()).setHours(new Date(this.utils.dateTimeZoneBrasil()).getHours() - 2))
        r = this.postsModel.aggregate([
            params,
            ...this.defaultGet(userId),
            {
                $addFields: {
                    likes_2h: {
                        $filter: {
                            input: "$like",
                            as: 'like',
                            cond: {
                                $and: [
                                    {
                                        $gte: [
                                            "$$like.created_at",
                                            dateFilterCommentaryReactions
                                        ]
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
                            as: "commentaries",
                            cond: {
                                $and: [
                                    {
                                        $gte: [
                                            "$$commentaries.created_at",
                                            dateFilterCommentaryReactions
                                        ]
                                    },
                                ]
                            }
                        }
                    }
                }
            },
            {
                $addFields: { comentary_count_aux: { $size: "$commentaries_2h" } }
            },
            {
                $addFields: { counter_sons: { $sum: "$commentaries_2h.counter" } }
            },
            {
                $addFields: { comentary_2h_count: { $sum: ["$counter_sons", "$comentary_count_aux"] } }
            },
            {
                $addFields: { likes_2h: { $size: "$likes_2h" } }
            },

            {
                "$addFields": {
                    "likes_commentaries": {
                        $sum: ["$comentary_2h_count", "$likes_2h"]
                    }
                }
            },
            { $project: { 'like': 0, 'dislike': 0, 'commentaries_2h': 0, 'commentaries': 0, counter_sons: 0, comentary_count_aux: 0 } },
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
            {
                "$match": {
                    deleted_at: null
                }
            },
            { $unwind: "$tags" },
            { "$group": { _id: "$tags", count: { $sum: 1 } } },
            { $sort: { "count": -1, _id: -1 } },
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
        if (r?.length > 0)
            return r[0]?.tags_details
        return null
    }
    async edit(dto: EditPost) {
        const { _id, ...query } = dto
        await this.postsModel.findOneAndUpdate(
            { _id: dto._id, user_id: dto.user_id },
            { ...query, updated_at: new Date(this.utils.dateTimeZoneBrasil()) },
            { upsert: true, new: false });
        return {
            message: 'ok'
        }
    }

    async findByid(id: ObjectId | string): Promise<Posts> {
        return this.postsModel.findById(id)
    }
}