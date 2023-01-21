import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Users, UsersDocument } from "database/schemas/users.schema";
import { Model } from "mongoose";
import { CreateUser, EditUser } from "./dto/users.create.dto";
import { UtilsService } from "modules/utils/utils.service";


@Injectable()
export class UsersRepository {
    constructor(
        @InjectModel(Users.name) private usersModel: Model<UsersDocument>,
        private readonly utils: UtilsService
    ) { }
    async create(body: CreateUser) {
        const userModel = new this.usersModel(body);
        await userModel.save();
        return {
            message: 'ok'
        }
    }
    async findAll(dto: any) {
        const { limit, page, ...query } = dto
        let r = this.usersModel
            .find()
        r = this.utils.applyFilter(query, r)
        return r.skip((dto.page - 1) * dto.limit)
            .sort({ _id: 'desc' })
            .limit(dto.limit)
            .exec()
    }
    async findOneByEmailOrUsername(dto: { email: string, username: string }) {
        return this.usersModel.findOne()
            .where({
                "$or": [
                    { username: dto.username },
                    { email: dto.email }
                ]
            })
            .exec()
    }
    async findOneByEmailOrUsernameBoolean(dto: { email: string, username: string }) {
        const user = await this.usersModel.findOne()
            .where({
                "$or": [
                    { username: dto.username },
                    { email: dto.email }
                ]
            })
            .exec()
        return {
            exist: !!user
        }
    }
    async patch(body: EditUser) {
        await this.usersModel.findOneAndUpdate(
            { _id: body._id },
            { ...body, updated_at: new Date() },
            { upsert: true, new: false });
        return {
            message: 'ok'
        }
    }


}