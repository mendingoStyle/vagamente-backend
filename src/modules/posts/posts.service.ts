import { Injectable } from "@nestjs/common";
import { GetPostUseCase } from "./useCases/posts.get.usecase";
import { Posts } from "database/schemas/posts.schema";
import { CreatePostUseCase } from "./useCases/posts.create.usecase";
import { GetPost } from "./dto/posts.get.dto";

@Injectable()
export class PostsService {
    constructor(
        private useCaseCreatePosts: CreatePostUseCase,
        private useCaseGetPosts: GetPostUseCase
    ) { }
    async create(body: any, file: Express.Multer.File): Promise<any> {
        return this.useCaseCreatePosts.create(body, file)
    }
    async findAll(dto: GetPost, token: string): Promise<Posts[]> {
        return this.useCaseGetPosts.findAll(dto, token)
    }

    async findCategories() {
        return this.useCaseGetPosts.findCategories()
    }
}