import { Injectable } from "@nestjs/common";
import { UtilsService } from "modules/utils/utils.service";
import { CreateComplaint } from "../dto/complaints.create.dto";


@Injectable()
export class ComplainsValidator {
    constructor(
        private readonly utils: UtilsService
    ) { }
    validateToSave(commentary: CreateComplaint) {
       
    }
    async findAllValidate(reaction) {
    }

}