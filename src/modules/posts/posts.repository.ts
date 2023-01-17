import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Posts, PostsDocument } from "database/schemas/posts.schema";
import { Model } from "mongoose";
import { CreatePost } from "./dto/posts.create.dto";
import { GetPost } from "./dto/posts.get.dto";

@Injectable()
export class PostsRepository {
    constructor(@InjectModel(Posts.name) private postsModel: Model<PostsDocument>) { }
    create(post: CreatePost) {
        const postModel = new this.postsModel(post);
        return postModel.save();
    }
    async findAll(dto: GetPost): Promise<Posts[]> {
        const { page, limit, ...query } = dto
        let r: any = null
        r = this.postsModel.find()

        Object.keys(query).forEach((item) => {
            if (query[item]) {
                r.where(item).equals(query[item])
            }
        });

        return r.skip((page - 1) * limit)
            .sort({ _id: 'desc' })
            .limit(limit)
            .exec()
    }

    async findCategories() {
        return this.postsModel.aggregate([
            { $unwind: "$tags" },
            { "$group": { _id: "$tags", count: { $sum: 1 } } },
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
            { $sort: { "count": 1 } },
            { $project: { "_id": 0, "tags_details": 1 } },
        ])
    }
}