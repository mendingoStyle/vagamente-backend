import { Injectable } from "@nestjs/common";
import { GetPostUseCase } from "./useCases/posts.get.usecase";
import { Posts } from "database/schemas/posts.schema";
import { CreatePostUseCase } from "./useCases/posts.create.usecase";
import { GetPost } from "./dto/posts.get.dto";
import { EditPost } from "./dto/posts.edit.dto";
import { EditPostUseCase } from "./useCases/posts.edit.usecase";
import { IAccessToken } from "modules/auth/interfaces/jwt.interface";

@Injectable()
export class PostsService {
    constructor(
        private readonly useCaseCreatePosts: CreatePostUseCase,
        private readonly useCaseGetPosts: GetPostUseCase,
        private readonly useCaseEditPosts: EditPostUseCase
    ) { }
    async create(body: any, file: Express.Multer.File, token?: string): Promise<any> {
        return this.useCaseCreatePosts.create(body, file, token)
    }
    async findAll(dto: GetPost, token: string): Promise<Posts[]> {
        return this.useCaseGetPosts.findAll(dto, token)
    }
    async findHot(dto: GetPost, token: string): Promise<Posts[]> {
        return this.useCaseGetPosts.findHot(dto, token)
    }
    async findTrending(dto: GetPost, token: string): Promise<Posts[]> {
        return this.useCaseGetPosts.findTrending(dto, token)
    }
    async findCategories() {
        return this.useCaseGetPosts.findCategories()
    }
    async edit(dto: EditPost, user: IAccessToken): Promise<any> {
        return this.useCaseEditPosts.edit(dto, user)
    }
}