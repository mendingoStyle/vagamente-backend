import { Injectable } from "@nestjs/common";
import { CreateCommentary } from "../dto/commentaries.create.dto";
import { UtilsService } from "modules/utils/utils.service";


@Injectable()
export class CommentariesValidator {
    constructor(
        private readonly utils: UtilsService
    ) { }
    validateToSave(commentary: CreateCommentary) {
        if (!commentary.answer_id && !commentary.post_id && !commentary._id)
            throw this.utils.throwErrorBadReqException('Preencha o id do post, da resposta ou do comentário')
    }
    async findAllValidate(reaction) {
    }

}