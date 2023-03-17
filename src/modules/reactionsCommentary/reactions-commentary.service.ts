import { Injectable } from "@nestjs/common";
import { GetReactionsCommentary } from "./dto/reactions.get.dto";
import { CreateReactionCommentary } from "./dto/reactions-commentary.create.dto";
import { CreateReactionsUseCase } from "./useCases/reactions-commentary.create.usecase";
import { GetReactionsUseCase } from "./useCases/reactions.get.usecase";



@Injectable()
export class ReactionsCommentaryService {
    constructor(
        private useCaseCreateReactions: CreateReactionsUseCase,
        private useCaseGetReactions: GetReactionsUseCase
    ) { }
    async create(body: CreateReactionCommentary, user_id) {
        return this.useCaseCreateReactions.create(body, user_id)
    }
    async findAll(dto: GetReactionsCommentary) {
        return this.useCaseGetReactions.findAll(dto)
    }
}