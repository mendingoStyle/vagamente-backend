import { Injectable } from "@nestjs/common";
import { GetCommentary } from "../dto/commentaries.get.dto";
import { CommentariesValidator } from "../validators/commentaries.validator";
import { CommentariesRepository } from "../commentaries.repository";
import { IAccessToken } from "modules/auth/interfaces/jwt.interface";
import { TokenService } from "modules/token/tokenController.service";




@Injectable()
export class GetCommentariesUseCase {
    constructor(
        private validator: CommentariesValidator,
        private repository: CommentariesRepository,
        private tokenController: TokenService

    ) { }
    async findAll(dto: GetCommentary, token: string) {
        let userId = null
        if (token)
            try {
                const user = await this.tokenController.verifyToken(token.split('Bearer ')[1])
                if (user) userId = user.id
            } catch (e) { }
        this.validator.findAllValidate(dto)
        return this.repository.findAll(dto, userId)
    }
}