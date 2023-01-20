import { Injectable } from "@nestjs/common";
import { PostsValidator } from "../validators/posts.validator";
import { PostsRepository } from "../posts.repository";
import { GetPost } from "../dto/posts.get.dto";
import { TokenService } from "modules/token/tokenController.service";

@Injectable()
export class GetPostUseCase {
    constructor(
        private validator: PostsValidator,
        private repository: PostsRepository,
        private tokenController: TokenService
    ) { }
    async   findAll(dto: GetPost, token: string) {
        this.validator.findAllValidate(dto, token)
        let userId = null
        if (token)
            try {
                const user = await this.tokenController.verifyToken(token.split('Bearer ')[1])
                if (user) userId = user.id
            } catch (e) { }
        return this.repository.findAll(dto, userId)
    }
    findCategories() {
        //this.validator.findAllValidate()
        return this.repository.findCategories()
    }
}