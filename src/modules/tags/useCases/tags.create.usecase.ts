import { Injectable } from "@nestjs/common";
import { UploadService } from "modules/upload/upload.service";
import { TagsValidator } from "../validator/tags.validator";
import { TagsRepository } from "../tags.repository";
import { CreateTags } from "../dto/tags.create.dto";

@Injectable()
export class CreateTagUseCase {
    constructor(
        private validator: TagsValidator,
        private repository: TagsRepository,
    ) { }
    async create(tag: CreateTags) {
        this.validator.validateToSave(tag)
        return this.repository.create(tag)
    }
}