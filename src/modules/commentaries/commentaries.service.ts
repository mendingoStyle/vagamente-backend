import { Injectable } from "@nestjs/common";
import { CreateCommentary } from "./dto/commentaries.create.dto";
import { GetCommentary } from "./dto/commentaries.get.dto";
import { CreateCommentariesUseCase } from "./useCases/commentaries.create.usecase";
import { GetCommentariesUseCase } from "./useCases/commentaries.get.usecase";
import { Commentaries } from "database/schemas/commentaries.schema";



@Injectable()
export class CommentariesService {
    constructor(
        private readonly useCaseCreateCommentaries: CreateCommentariesUseCase,
        private readonly useCaseGetCommentaries: GetCommentariesUseCase
    ) { }
    async create(body: CreateCommentary, userId: string): Promise<Commentaries> {
        return this.useCaseCreateCommentaries.create(body, userId)
    }
    async findAll(dto: GetCommentary): Promise<any> {
        return this.useCaseGetCommentaries.findAll(dto)
    }
}