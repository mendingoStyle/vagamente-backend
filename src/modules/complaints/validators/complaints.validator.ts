import { Injectable } from "@nestjs/common";
import { UtilsService } from "modules/utils/utils.service";
import { CreateComplaint } from "../dto/complaints.create.dto";


@Injectable()
export class ComplainsValidator {
    constructor(
        private readonly utils: UtilsService
    ) { }
    validateToSave(commentary: CreateComplaint) {
        if (!commentary.post_id && !commentary.commentary_id)
            throw this.utils.throwErrorBadReqException('Preencha o id do post ou da comentario')
    }
    async findAllValidate(reaction) {
    }

}