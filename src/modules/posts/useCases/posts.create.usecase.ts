import { Injectable } from "@nestjs/common";
import { CreatePost } from "../dto/posts.create.dto";
import { PostsValidator } from "../validators/posts.validator";
import { Posts } from "database/schemas/posts.schema";
import { PostsRepository } from "../posts.repository";
import { UploadService } from "modules/upload/upload.service";
import { TagsService } from "modules/tags/tags.service";
import { TokenService } from "modules/token/tokenController.service";
import mongoose from "mongoose";
import { UtilsService } from "modules/utils/utils.service";

@Injectable()
export class CreatePostUseCase {
    constructor(
        private validator: PostsValidator,
        private repository: PostsRepository,
        private readonly uploadService: UploadService,
        private readonly tagsService: TagsService,
        private readonly tokenController: TokenService,
        private readonly utils: UtilsService

    ) { }
    async create(post: CreatePost, file: Express.Multer.File, token?: string) {
        try {
            let img = null

            if (!post.content_resource) {
                img = await this.uploadService.create(file)
            }
            else {
                img = {
                    secure_url: post.content_resource
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
                ...post, created_at: new Date(this.utils.dateTimeZoneBrasil()), updated_at: new Date(this.utils.dateTimeZoneBrasil()), content_resource: img?.secure_url
            }
            this.validator.validateToSave(postWithTimeAndFile)
            if (token)
                try {
                    const user = await this.tokenController.verifyToken(token.split('Bearer ')[1])
                    if (user) postWithTimeAndFile.user_id = user.id
                } catch (e) {
                    console.log(e)
                }
            const postSaved = await this.repository.create(postWithTimeAndFile)
            const titleFormated = postSaved.title.replace(/[^A-Za-z0-9]/g, "");
            let slug = ''
            if (titleFormated && titleFormated !== '') {
                slug = `${titleFormated}-${postSaved._id.toString()}`
            } else
                slug = `${postSaved._id.toString()}`
            await this.repository.editSlug(postSaved, slug)
            return postSaved
        } catch (e) {
            console.log(e)
        }
    }
}