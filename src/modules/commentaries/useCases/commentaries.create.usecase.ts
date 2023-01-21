import { Injectable } from "@nestjs/common";
import { CreateCommentary } from "../dto/commentaries.create.dto";
import { CommentariesValidator } from "../validators/commentaries.validator";
import { CommentariesRepository } from "../commentaries.repository";



@Injectable()
export class CreateCommentariesUseCase {
    constructor(
        private validator: CommentariesValidator,
        private repository: CommentariesRepository,
    ) { }
    async create(body: CreateCommentary, user_id: string) {
        body.user_id = user_id
        this.validator.validateToSave(body)
        return this.repository.create(body)
    }
}