import { Injectable } from "@nestjs/common";
import { TagsValidator } from "../validators/tags.validator";
import { TagsRepository } from "../tags.repository";
import { GetTag } from "../dto/tags.get.dto";


@Injectable()
export class GetTagsUseCase {
    constructor(
        private validator: TagsValidator,
        private repository: TagsRepository,
    ) { }
    findAll(dto: GetTag) {
        this.validator.findAllValidate(dto)
        return this.repository.findAll(dto)
    }
}