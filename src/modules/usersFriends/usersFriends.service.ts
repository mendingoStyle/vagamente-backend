import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UsersFriendEnum, UsersFriends, UsersFriendsDocument } from "database/schemas/users_friends.schema";
import { Model } from "mongoose";
import { CreateUsersFriends } from "./dto/usersFriends.create.dto";
import { UtilsService } from "modules/utils/utils.service";
import { GetUsersFriends } from "./dto/usersFriends.get.dto";
import { UsersRepository } from "modules/users/users.repository";
import { NotificationsService } from "modules/notifications/notifications.service";
import { NotificationsEnum } from "database/schemas/notifications.schema";
import { IAccessToken } from "modules/auth/interfaces/jwt.interface";

@Injectable()
export class UsersFriendsService {
    constructor(
        @InjectModel(UsersFriends.name) private usersFriendsModel: Model<UsersFriendsDocument>,
        private readonly utils: UtilsService,
        private userRepository: UsersRepository,
        private notificationsService: NotificationsService,
    ) { }

    async create(body: CreateUsersFriends) {
        const usersFriendsRequest = await this.usersFriendsModel.findOneAndUpdate(
            { user_id: body.user_id, friend_id: body.friend_id },
            { ...body, created_at: new Date(this.utils.dateTimeZoneBrasil()), updated_at: new Date(this.utils.dateTimeZoneBrasil()) },
            { upsert: true, new: true });
        if (usersFriendsRequest._id && usersFriendsRequest.status === UsersFriendEnum.waiting) {
            await this.notificationsService.create({
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null,
                title: 'enviou uma solicitação de amizade',
                url: process.env.FRONT_URL + 'post/',
                isRead: false,
                to_user_id: usersFriendsRequest.friend_id,
                from_user_id: usersFriendsRequest.user_id,
                type: NotificationsEnum.friendRequest
            }, await this.userRepository.findOneById(usersFriendsRequest.friend_id))
        }
    }

    async findAll(dto: GetUsersFriends, user: IAccessToken) {
        const { page, limit, ...query } = dto
        let r: any = null
        let params = null



        params = this.utils.applyFilterAggregate({ ...query, deleted_at: null })

        r = this.usersFriendsModel.aggregate([
            {
                ...params,
                "$match": {
                    $or: [
                        { friend_id: user.id },
                        { user_id: user.id },
                    ]
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                "$addFields": {
                    "user.password": {
                        "$cond": [
                            { "$eq": [true, true] },
                            "$$REMOVE",
                            0
                        ]
                    }
                }
            },
            {
                "$addFields": {
                    "user": {
                        "$cond": [
                            {
                                $or: [
                                    { "$eq": [{ "$type": "$deleted_at" }, "missing"] },
                                    { "$eq": [{ "$type": "$deleted_at" }, "null"] },
                                ]
                            },
                            "$user",
                            "$$REMOVE",
                        ]
                    },
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

}