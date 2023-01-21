import { Injectable } from "@nestjs/common";
import { CreateUser, EditUser } from "./dto/users.create.dto";
import { GetUser } from "./dto/users.get.dto";
import { CreateUserUseCase } from "./useCases/users.create.usecase";
import { GetUserUseCase } from "./useCases/users.get.usecase";
import { Users } from "database/schemas/users.schema";
import { EditUserUseCase } from "./useCases/users.edit.usecase";

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
    async patch(body: EditUser, file: Express.Multer.File, userId: string) {
        return this.useCaseEditUser.patch(body, file, userId)
    }
    async findAll(dto: GetUser) {
        return this.useCaseGetUser.findAll(dto)
    }

    async getCredentials(dto: any): Promise<any> {

    }
    async getCredentialsLogin(dto: { email: string }): Promise<Users> {
        const result = await this.findAll({ ...dto })
        if (result.length > 0) {
            return result[0]
        }
        return null
    }
    async verifyEmailUsername(dto){
        return this.useCaseGetUser.verifyEmailUsername(dto)
    }


}