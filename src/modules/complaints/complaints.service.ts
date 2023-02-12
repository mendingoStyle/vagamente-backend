import { Injectable } from "@nestjs/common";
import { CreateComplaintsUseCase } from "./useCases/complaints.create.usecase";
import { GetComplaintsUseCase } from "./useCases/complaints.get.usecase";
import { CreateComplaint } from "./dto/complaints.create.dto";
import { GetComplaint } from "./dto/complaints.get.dto";

@Injectable()
export class ComplaintsService {
    constructor(
        private useCaseCreateComplaints: CreateComplaintsUseCase,
        private useCaseGetComplaints: GetComplaintsUseCase
    ) { }
    create(body: CreateComplaint, user: string) {
        return this.useCaseCreateComplaints.create(body, user)
    }
    findAll(dto: GetComplaint) {
        return this.useCaseGetComplaints.findAll(dto)

    }
}