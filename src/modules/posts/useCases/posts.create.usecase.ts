import { Injectable } from "@nestjs/common";
import { createPost } from "../dto/posts.create.dto";
import { PostsValidator } from "../validator/posts.validator";
import { Posts } from "database/schemas/posts.schema";
import { PostsRepository } from "../posts.repository";
import { UploadService } from "modules/upload/upload.service";

@Injectable()
export class CreatePostUseCase {
    constructor(
        private validator: PostsValidator,
        private repository: PostsRepository,
        private readonly uploadService: UploadService
    ) { }
    async create(post: createPost, file) {
        const postWithTime = {
            ...post, created_at: new Date(), updated_at: new Date()
        }
        const img = await this.uploadService.create(file)
        this.validator.validateToSave(postWithTime)
        return this.repository.create(postWithTime, file)
    }
}