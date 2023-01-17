import { Injectable } from "@nestjs/common";
import { CreatePost } from "../dto/posts.create.dto";
import { PostsValidator } from "../validator/posts.validator";
import { Posts } from "database/schemas/posts.schema";
import { PostsRepository } from "../posts.repository";
import { UploadService } from "modules/upload/upload.service";
import { TagsService } from "modules/tags/tags.service";

@Injectable()
export class CreatePostUseCase {
    constructor(
        private validator: PostsValidator,
        private repository: PostsRepository,
        private readonly uploadService: UploadService,
        private readonly tagsService: TagsService
    ) { }
    async create(post: CreatePost, file: Express.Multer.File) {
        let img = null
        if (!post.content_resource)
            img = await this.uploadService.create(file)
        else {
            img = {
                url: post.content_resource
            }
        }
        if (post.tags) {
            const parse = Array.isArray(post.tags) ? post.tags : JSON.parse(post.tags)
            post.tags = parse
            parse.map((t: string) => {
                this.tagsService.create({ title: t })
            })
        }
        const postWithTimeAndFile = {
            ...post, created_at: new Date(), updated_at: new Date(), content_resource: img?.url
        }
        this.validator.validateToSave(postWithTimeAndFile)
        return this.repository.create(postWithTimeAndFile)
    }
}