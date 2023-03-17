import { Injectable } from "@nestjs/common";
import { CreateReactionCommentary } from "../dto/reactions-commentary.create.dto";
import { ReactionsCommentaryValidator } from "../validators/reactions-commentary.validator";
import { ReactionsCommentaryRepository } from "../reactions-commentary.repository";


@Injectable()
export class CreateReactionsUseCase {
    constructor(
        private validator: ReactionsCommentaryValidator,
        private repository: ReactionsCommentaryRepository,
    ) { }
    async create(reaction: CreateReactionCommentary, user_id: string) {
        this.validator.validateToSave(reaction)
        return this.repository.create(reaction, user_id)
    }
}