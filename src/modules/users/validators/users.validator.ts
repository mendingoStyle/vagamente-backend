import { Injectable } from "@nestjs/common";
import { CreateUser } from "../dto/users.create.dto";
import { GetUser } from "../dto/users.get.dto";
import * as bcrypt from 'bcrypt'
import { UsersRepository } from "../users.repository";
import { UtilsService } from "modules/utils/utils.service";



@Injectable()
export class UsersValidator {
    constructor(
        private readonly repository: UsersRepository,
        private readonly utils: UtilsService
    ) { }
    async validateToSave(dto: CreateUser): Promise<CreateUser> {
        const verify = await this.repository.findOneByEmailOrUsername({ email: dto.email, username: dto.username })
        if (verify) {
            if (verify.email === dto.email) {
                throw this.utils.throwErrorBadReqException('email já cadastrado')
            } else {
                throw this.utils.throwErrorBadReqException('username já cadastrado')
            }
        }
        const hashedPassword = await bcrypt.hash(dto.password, 12)
        dto.password = hashedPassword
        return dto
    }
    async findAllValidate(dto: GetUser) {
    }

}