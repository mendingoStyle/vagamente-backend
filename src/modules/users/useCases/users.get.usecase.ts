import { Injectable } from "@nestjs/common";
import { GetUser, GetUserSearch } from "../dto/users.get.dto";
import { UsersValidator } from "../validators/users.validator";
import { UsersRepository } from "../users.repository";
import { TokenService } from "modules/token/tokenController.service";
import { UtilsService } from "modules/utils/utils.service";


@Injectable()
export class GetUserUseCase {
    constructor(
        private readonly validator: UsersValidator,
        private readonly repository: UsersRepository,
        private readonly token: TokenService,
        private readonly utils: UtilsService
    ) { }
    async findAll(dto: GetUser) {
        this.validator.findAllValidate(dto)

        const user = await this.repository.findAll(dto)
        if (user && user.length > 0) {
            user[0].password = undefined
        }
        return user
    }
    async findAllWithPassword(dto: GetUser) {
        this.validator.findAllValidate(dto)
        const user = await this.repository.findAll(dto)
        return user
    }
    async verifyEmailUsername(dto: {
        email: string,
        username: string
    }, token: string): Promise<{
        exist: boolean;
    }> {
        this.validator.findAllValidateVerifyUsernameEmail(dto)
        let user = null
        if (token) {
            user = await this.token.verifyToken(token.split('Bearer ')[1])
        }
        if (token && !user) throw this.utils.throwUnauthorizedException('Token inválido')
        return this.repository.findOneByEmailOrUsernameBoolean(dto, user?.id)
    }
    topUsers() {
        return this.repository.topUsers()
    }
    async find(dto: GetUserSearch){
        return this.repository.find(dto)
    }

}