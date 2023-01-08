import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Posts, PostsDocument } from "database/schemas/posts.schema";
import { Model } from "mongoose";
import { createPost } from "./dto/posts.create.dto";

@Injectable()
export class PostsRepository {
    constructor(@InjectModel(Posts.name) private postsModel: Model<PostsDocument>) { }
    create(post: createPost, file) {
        const postModel = new this.postsModel(post);
        return postModel.save();
    }
    async findAll(): Promise<Posts[]> {
        return this.postsModel.find().exec();
    }
}