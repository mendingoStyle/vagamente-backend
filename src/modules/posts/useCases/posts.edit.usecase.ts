import { Injectable } from "@nestjs/common";
import { CreatePost } from "../dto/posts.create.dto";
import { PostsValidator } from "../validators/posts.validator";
import { Posts } from "database/schemas/posts.schema";
import { PostsRepository } from "../posts.repository";
import { UploadService } from "modules/upload/upload.service";
import { TagsService } from "modules/tags/tags.service";
import { TokenService } from "modules/token/tokenController.service";
import mongoose from "mongoose";
import { EditPost } from "../dto/posts.edit.dto";
import { IAccessToken } from "modules/auth/interfaces/jwt.interface";

@Injectable()
export class EditPostUseCase {
    constructor(
        private validator: PostsValidator,
        private repository: PostsRepository,
    ) { }
    async edit(post: EditPost, user: IAccessToken) {
        post.user_id = user.id
        this.validator.edit(post)
        return this.repository.edit(post)
    }
}