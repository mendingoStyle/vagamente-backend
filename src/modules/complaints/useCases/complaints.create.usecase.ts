import { Injectable } from "@nestjs/common";
import { ComplaintsRepository } from "../complaints.repository";
import { CreateComplaint } from "../dto/complaints.create.dto";
import { ComplainsValidator } from "../validators/complaints.validator";

@Injectable()
export class CreateComplaintsUseCase {
    constructor(
        private readonly repository: ComplaintsRepository,
        private readonly validator: ComplainsValidator
    ) { }
    create(body: CreateComplaint, user: string) {
        this.validator.validateToSave(body)
        return this.repository.create({
            ...body,
            user_id: user
        })
    }
}