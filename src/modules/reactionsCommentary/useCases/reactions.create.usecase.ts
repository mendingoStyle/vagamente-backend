import { Injectable } from "@nestjs/common";
import { ReactionsValidator } from "../validators/reactions.validator";
import { ReactionsRepository } from "../reactions-commentary.repository";
import { CreateReaction } from "../dto/reactions.create.dto";


@Injectable()
export class CreateReactionsUseCase {
    constructor(
        private validator: ReactionsValidator,
        private repository: ReactionsRepository,
    ) { }
    async create(reaction: CreateReaction, user_id: string) {
        this.validator.validateToSave(reaction)
        return this.repository.create(reaction, user_id)
    }
}