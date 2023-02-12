import { Injectable } from "@nestjs/common";
import { ComplaintsRepository } from "../complaints.repository";
import { GetComplaint } from "../dto/complaints.get.dto";

@Injectable()
export class GetComplaintsUseCase {
    constructor(
        private readonly repository: ComplaintsRepository
    ) { }
    findAll(dto: GetComplaint) {
        return this.repository.findAll(dto)
    }
}