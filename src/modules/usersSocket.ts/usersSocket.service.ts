import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UtilsService } from "modules/utils/utils.service";
import { UsersSocket } from "database/schemas/users_socket.schema";
import { CreateUsersSocket } from "./dto/usersSocket.create.dto";
import { GetUsersSocket } from "./dto/usersSocket.get.dto";


@Injectable()
export class UsersSocketService {
    constructor(
        @InjectModel(UsersSocket.name) private usersSocket: Model<UsersSocket>,
        private readonly utils: UtilsService
    ) { }
    create(userSocketDto: CreateUsersSocket) {
        return this.usersSocket.create(
            {
                ...userSocketDto,
                created_at: new Date(this.utils.dateTimeZoneBrasil()),
                updated_at: new Date(this.utils.dateTimeZoneBrasil()),
                deleted_at: null
            },
        )
    }

    delete(clientId: string) {
        return this.usersSocket.deleteOne(
            {
                socket_id: clientId
            }
        )
    }
    async findAll(dto: GetUsersSocket): Promise<UsersSocket[]> {
        return await this.usersSocket
            .find()
            .where({
                "$match": {
                    ...dto
                }
            })
            .exec()
    }

}