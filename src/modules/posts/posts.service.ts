import { Injectable } from "@nestjs/common";
import { GetPostUseCase } from "./useCases/posts.get.usecase";
import { Posts } from "database/schemas/posts.schema";
import { CreatePostUseCase } from "./useCases/posts.create.usecase";

@Injectable()
export class PostsService {
    constructor(
        private useCaseCreatePosts: CreatePostUseCase,
        private useCaseGetPosts: GetPostUseCase
    ) { }
    async create(body: any, file): Promise<any> {
        return this.useCaseCreatePosts.create(body, file)
    }
    async findAll(): Promise<Posts[]> {
        return this.useCaseGetPosts.findAll()
    }
}