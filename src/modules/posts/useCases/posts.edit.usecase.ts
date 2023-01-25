import { Injectable } from "@nestjs/common";
import { PostsValidator } from "../validators/posts.validator";
import { PostsRepository } from "../posts.repository";
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