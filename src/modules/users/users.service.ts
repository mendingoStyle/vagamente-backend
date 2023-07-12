import { Injectable } from "@nestjs/common";
import { CreateUser, EditUser } from "./dto/users.create.dto";
import { GetUser, GetUserSearch } from "./dto/users.get.dto";
import { CreateUserUseCase } from "./useCases/users.create.usecase";
import { GetUserUseCase } from "./useCases/users.get.usecase";
import { Users } from "database/schemas/users.schema";
import { EditUserUseCase } from "./useCases/users.edit.usecase";
import { ForgetPasswordPayloadDto } from "modules/token/dto/forgetPassword.dto";
import { UserChangePasswordDTO } from "./dto/recovery-password.dto";

@Injectable()
export class UsersService {
    constructor(
        private readonly useCaseCreateUser: CreateUserUseCase,
        private readonly useCaseGetUser: GetUserUseCase,
        private readonly useCaseEditUser: EditUserUseCase
    ) { }
    async create(body: CreateUser) {
        return this.useCaseCreateUser.create(body)
    }
    async patch(body: EditUser, file: Express.Multer.File, userId: string, file_cape: Express.Multer.File) {
        return this.useCaseEditUser.patch(body, file, userId,file_cape)
    }
    async findAll(dto: GetUser) {
        return this.useCaseGetUser.findAll(dto)
    }

    async getCredentials(dto: any): Promise<any> {

    }
    async getCredentialsLogin(dto: { email: string }): Promise<Users> {
        const result = await this.useCaseGetUser.findAllWithPassword({ ...dto })
        if (result.length > 0) {
            return result[0]
        }
        return null
    }
    async verifyEmailUsername(dto: {
        email: string,
        username: string
    }, token: string) {
        return this.useCaseGetUser.verifyEmailUsername(dto, token)
    }

    async sendEmail(user: ForgetPasswordPayloadDto) {
        return this.useCaseEditUser.sendEmail(user)
    }

    async recoveryPassword(dto: UserChangePasswordDTO, token: string) {
        return this.useCaseEditUser.recoveryPassword(dto, token)
    }

    topUsers() {
        return this.useCaseGetUser.topUsers()
    }

    async find(dto: GetUserSearch) {
        return this.useCaseGetUser.find(dto)
    }
    
    async findById(dto: GetUserSearch, token: string) {
        return this.useCaseGetUser.findById(dto, token)
    }


}