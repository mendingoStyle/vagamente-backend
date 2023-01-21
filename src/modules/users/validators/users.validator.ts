import { Injectable } from "@nestjs/common";
import { CreateUser, EditUser } from "../dto/users.create.dto";
import { GetUser } from "../dto/users.get.dto";
import { UsersRepository } from "../users.repository";
import { UtilsService } from "modules/utils/utils.service";



@Injectable()
export class UsersValidator {
    constructor(
        private readonly repository: UsersRepository,
        private readonly utils: UtilsService
    ) { }
    async validateToSave(dto: CreateUser | EditUser) {
        const verify = await this.repository.findOneByEmailOrUsername({ email: dto.email, username: dto.username })
        if (verify) {
            if (verify.email === dto.email) {
                throw this.utils.throwErrorBadReqException('email já cadastrado')
            } else {
                throw this.utils.throwErrorBadReqException('username já cadastrado')
            }
        }


    }
    async findAllValidate(dto: GetUser) {
    }
    async findAllValidateVerifyUsernameEmail(dto: GetUser) {
        if (!dto.username && !dto.email) {
            throw this.utils.throwErrorBadReqException('preencha o email ou username')
        }
    }

}