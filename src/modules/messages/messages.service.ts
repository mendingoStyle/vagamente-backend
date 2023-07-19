import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Messages, MessagesDocument } from "database/schemas/messages.schema";
import { UtilsService } from "modules/utils/utils.service";
import mongoose, { Model } from "mongoose";
import { GetMessagesDto } from "./dto/messages.get.dto";
import { IAccessToken } from "modules/auth/interfaces/jwt.interface";
import { CreateMessagesDto } from "./dto/messages.create.dto";
import { UsersFriendsService } from "modules/usersFriends/usersFriends.service";
import { UsersFriendEnum, UsersFriends } from "database/schemas/users_friends.schema";
import { ReadAllMessagesDto } from "./dto/messages.patch.dto";
import { SocketGateway } from "modules/socket/socket.gateway";

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(Messages.name) private messagesModel: Model<MessagesDocument>,
        private readonly utils: UtilsService,
        private readonly friendshipService: UsersFriendsService,
        private sockerGateway: SocketGateway,

    ) { }

    async findAll(dto: GetMessagesDto, user: IAccessToken) {
        const { page, limit, ...query } = dto
        let r: any = null
        const params = this.utils.applyFilterAggregate({ ...query, deleted_at: null })

        r = this.messagesModel.aggregate([
            params,

            {
                $lookup: {
                    from: 'usersfriends',
                    localField: 'user_friend_id',
                    foreignField: '_id',
                    as: 'friends',
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'from_user_id',
                    foreignField: '_id',
                    as: 'from_user',
                },
            },
            {
                $match: {
                    $or: [
                        {
                            "friends.friend_id": new mongoose.Types.ObjectId(user.id)
                        },
                        {
                            "friends.user_id": new mongoose.Types.ObjectId(user.id)
                        },
                    ]
                }
            },
            {
                "$addFields": {
                    "from_user.password": {
                        "$cond": [
                            { "$eq": [true, true] },
                            "$$REMOVE",
                            0
                        ]
                    }
                }
            },
            { $sort: { _id: -1 } },
            {
                '$facet': {
                    data: [{ $skip: (page - 1) * limit }, { $limit: limit },
                    ],
                    totalCount: [
                        {
                            $count: 'count'
                        }
                    ]

                }
            }
        ])
        const result = (await r.exec())[0]
        return {
            total: result?.totalCount[0]?.count,
            data: result?.data
        }
    }
    async create(body: CreateMessagesDto, user: IAccessToken) {
        const friendship = await this.verifyFriendShip(body, user)

        const message = await this.messagesModel.create({
            ...body,
            from_user_id: user.id,
            created_at: new Date(),
            updated_at: new Date(),
            isRead: false
        })
        let msg: any = await this.findAll({ _id: message._id, page: 1, limit: 1 }, user)
        if (msg.data && msg.data.length > 0) {
            msg = msg.data[0]
        }
        this.sockerGateway.sendMessageNotifications({
            message: msg,
            to_user_id: friendship.user_id.toString() !== user.id ? friendship.user_id.toString() : friendship.friend_id.toString()
        })
        return message
    }

    async readAll(body: ReadAllMessagesDto, user: IAccessToken) {
        await this.verifyFriendShip(body, user)

        return this.messagesModel.updateMany(
            {
                user_friend_id: body.user_friend_id,
                from_user_id: { $ne: user.id },
                isRead: false
            },
            {
                isRead: true
            }
        )
    }

    async verifyFriendShip(body: any, user: IAccessToken): Promise<UsersFriends> {
        const verifyFriendShip = await this.friendshipService.findOneById(body.user_friend_id)

        if (verifyFriendShip.status !== UsersFriendEnum.accepted
            || (verifyFriendShip.friend_id.toString() !== user.id
                && verifyFriendShip.user_id.toString() !== user.id))
            throw this.utils.throwForbiddenException('Amizade não encontrada')
        return verifyFriendShip
    }
}
