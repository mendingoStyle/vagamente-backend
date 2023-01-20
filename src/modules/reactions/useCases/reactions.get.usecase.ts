import { Injectable } from "@nestjs/common";
import { GetReactions } from "../dto/reactions.get.dto";
import { ReactionsValidator } from "../validators/reactions.validator";
import { ReactionsRepository } from "../reactions.repository";



@Injectable()
export class GetReactionsUseCase {
    constructor(
        private validator: ReactionsValidator,
        private repository: ReactionsRepository,
    ) { }
    findAll(dto: GetReactions) {
        this.validator.findAllValidate(dto)
        return this.repository.findAll(dto)
    }
}