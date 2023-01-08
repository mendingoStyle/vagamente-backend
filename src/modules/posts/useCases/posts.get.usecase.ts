import { Injectable } from "@nestjs/common";
import { PostsValidator } from "../validator/posts.validator";
import { PostsRepository } from "../posts.repository";

@Injectable()
export class GetPostUseCase {
    constructor(
        private validator: PostsValidator,
        private repository: PostsRepository,

    ) { }
    findAll() {
        this.validator.findAllValidate()
        return this.repository.findAll()
    }
}