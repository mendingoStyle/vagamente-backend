import { Injectable } from "@nestjs/common";
import { GetCommentary } from "../dto/commentaries.get.dto";
import { CommentariesValidator } from "../validators/commentaries.validator";
import { CommentariesRepository } from "../commentaries.repository";




@Injectable()
export class GetCommentariesUseCase {
    constructor(
        private validator: CommentariesValidator,
        private repository: CommentariesRepository,
    ) { }
    findAll(dto: GetCommentary) {
        this.validator.findAllValidate(dto)
        return this.repository.findAll(dto)
    }
}