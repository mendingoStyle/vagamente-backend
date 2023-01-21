import { Injectable } from "@nestjs/common";
import { CreateCommentary } from "../dto/commentaries.create.dto";
import { UtilsService } from "modules/utils/utils.service";


@Injectable()
export class CommentariesValidator {
    constructor(
        private readonly utils: UtilsService
    ) { }
    async validateToSave(reaction: CreateCommentary): Promise<any> {
        if (!reaction.answer_id && !reaction.post_id)
            throw this.utils.throwErrorBadReqException('Preencha o id do post ou da resposta')
    }
    async findAllValidate(reaction) {
    }

}