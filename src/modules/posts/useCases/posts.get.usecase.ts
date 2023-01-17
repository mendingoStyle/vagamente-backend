import { Injectable } from "@nestjs/common";
import { PostsValidator } from "../validator/posts.validator";
import { PostsRepository } from "../posts.repository";
import { GetPost } from "../dto/posts.get.dto";

@Injectable()
export class GetPostUseCase {
    constructor(
        private validator: PostsValidator,
        private repository: PostsRepository,

    ) { }
    findAll(dto: GetPost) {
        this.validator.findAllValidate()
        return this.repository.findAll(dto)
    }
    findCategories() {
        this.validator.findAllValidate()
        return this.repository.findCategories()
    }
}