import { Injectable } from "@nestjs/common";
import { Tags } from "database/schemas/tags.schema";
import { GetTag } from "./dto/tags.get.dto";
import { CreateTagUseCase } from "./useCases/tags.create.usecase";
import { GetTagsUseCase } from "./useCases/tags.get.usecase";
import { CreateTags } from "./dto/tags.create.dto";


@Injectable()
export class TagsService {
    constructor(
        private useCaseCreateTags: CreateTagUseCase,
        private useCaseGetTags: GetTagsUseCase
    ) { }
    async create(body: CreateTags) {
        return this.useCaseCreateTags.create(body)
    }
    async findAll(dto: GetTag) {
        return this.useCaseGetTags.findAll(dto)
    }
}