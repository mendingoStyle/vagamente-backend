import { Injectable } from "@nestjs/common";
import { CreateUser } from "./dto/users.create.dto";
import { GetUser } from "./dto/users.get.dto";
import { CreateUserUseCase } from "./useCases/users.create.usecase";
import { GetUserUseCase } from "./useCases/users.get.usecase";
import { Users } from "database/schemas/users.schema";

@Injectable()
export class UsersService {
    constructor(
        private readonly useCaseCreateUser: CreateUserUseCase,
        private readonly useCaseGetUser: GetUserUseCase
    ) { }
    async create(body: CreateUser) {
        return this.useCaseCreateUser.create(body)
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


}