import { Injectable } from "@nestjs/common";
import { GetUser } from "../dto/users.get.dto";
import { UsersValidator } from "../validators/users.validator";
import { UsersRepository } from "../users.repository";


@Injectable()
export class GetUserUseCase {
    constructor(
        private readonly validator: UsersValidator,
        private readonly repository: UsersRepository
    ) { }
    findAll(dto: GetUser) {
        this.validator.findAllValidate(dto)
        return this.repository.findAll(dto)
    }
    verifyEmailUsername(dto): Promise<{
        exist: boolean;
    }> {
        this.validator.findAllValidateVerifyUsernameEmail(dto)
        return this.repository.findOneByEmailOrUsernameBoolean(dto)
    }
}