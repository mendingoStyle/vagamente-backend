import { Injectable } from "@nestjs/common";
import { CreateUser } from "../dto/users.create.dto";
import { UsersValidator } from "../validators/users.validator";
import { UsersRepository } from "../users.repository";
import { UtilsService } from "modules/utils/utils.service";


@Injectable()
export class CreateUserUseCase {
    constructor(
        private readonly validator: UsersValidator,
        private readonly repository: UsersRepository,
        private readonly utils: UtilsService
    ) { }
    async create(body: CreateUser) {
        try {
            body = await this.validator.validateToSave(body)
            return this.repository.create(body)
        } catch (e) {
            if (e.message)
                throw this.utils.throwErrorBadReqException(e.message)
            else
                throw this.utils.throwErrorBadReqException(e)
        }
    }
}