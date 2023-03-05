import { Injectable } from "@nestjs/common";
import { GetReactions } from "./dto/reactions.get.dto";
import { CreateReaction } from "./dto/reactions.create.dto";
import { CreateReactionsUseCase } from "./useCases/reactions.create.usecase";
import { GetReactionsUseCase } from "./useCases/reactions.get.usecase";



@Injectable()
export class ReactionsService {
    constructor(
        private useCaseCreateReactions: CreateReactionsUseCase,
        private useCaseGetReactions: GetReactionsUseCase
    ) { }
    async create(body: CreateReaction, user_id) {
        return this.useCaseCreateReactions.create(body, user_id)
    }
    async findAll(dto: GetReactions) {
        return this.useCaseGetReactions.findAll(dto)
    }
}