import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Messages, MessagesDocument } from "database/schemas/messages.schema";
import { UtilsService } from "modules/utils/utils.service";
import mongoose, { Model } from "mongoose";
import { GetMessagesDto } from "./dto/messages.get.dto";
import { IAccessToken } from "modules/auth/interfaces/jwt.interface";
import { CreateMessagesDto } from "./dto/messages.create.dto";
import { UsersFriendsService } from "modules/usersFriends/usersFriends.service";
import { UsersFriendEnum } from "database/schemas/users_friends.schema";

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(Messages.name) private messagesModel: Model<MessagesDocument>,
        private readonly utils: UtilsService,
        private readonly friendshipService: UsersFriendsService
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
        const verifyFriendShip = await this.friendshipService.findOneById(body.user_friend_id)

        if (verifyFriendShip.status !== UsersFriendEnum.accepted
            || (verifyFriendShip.friend_id.toString() !== user.id
                && verifyFriendShip.user_id.toString() !== user.id))
            throw this.utils.throwForbiddenException('Amizade não encontrada')

        return this.messagesModel.create({ 
            ...body, 
            from_user_id: user.id,
            created_at: new Date(),
            updated_at: new Date(),
            isRead: false
        })
    }
}
