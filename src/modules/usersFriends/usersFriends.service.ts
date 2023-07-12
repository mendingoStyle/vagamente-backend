import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UsersFriendEnum, UsersFriends, UsersFriendsDocument } from "database/schemas/users_friends.schema";
import mongoose, { Model } from "mongoose";
import { CreateUsersFriends } from "./dto/usersFriends.create.dto";
import { UtilsService } from "modules/utils/utils.service";
import { GetUsersFriends } from "./dto/usersFriends.get.dto";
import { UsersRepository } from "modules/users/users.repository";
import { NotificationsEnum } from "database/schemas/notifications.schema";
import { IAccessToken } from "modules/auth/interfaces/jwt.interface";
import { SocketGateway } from "modules/socket/socket.gateway";

@Injectable()
export class UsersFriendsService {
    constructor(
        @InjectModel(UsersFriends.name) private usersFriendsModel: Model<UsersFriendsDocument>,
        private readonly utils: UtilsService,
        private userRepository: UsersRepository,
        private sockerGateway: SocketGateway,
    ) { }

    async sendFriendRequest(body: CreateUsersFriends) {
        const existsFriendRequest = await this.usersFriendsModel.findOne(
            {
                $or: [
                    {
                        friend_id: body.friend_id,
                        user_id: body.user_id
                    },
                    {
                        friend_id: body.user_id,
                        user_id: body.friend_id
                    }
                ]
            }
        );

        if (existsFriendRequest) {
            return existsFriendRequest;
        }

        const usersFriendsRequest = await this.usersFriendsModel
            .findOneAndUpdate(
                { user_id: body.user_id, friend_id: body.friend_id },
                { ...body, created_at: new Date(this.utils.dateTimeZoneBrasil()), updated_at: new Date(this.utils.dateTimeZoneBrasil()) },
                { upsert: true, new: true }
            );

        if (usersFriendsRequest._id && usersFriendsRequest.status === UsersFriendEnum.waiting) {
            const user = await this.userRepository.findOneById(body.user_id);
            this.sockerGateway.sendFriendNotifications({
                user,
                from_user_id: body.user_id,
                to_user_id: body.friend_id,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null,
                title: 'enviou uma solicitação de amizade',
                url: `${process.env.FRONT_URL}perfil/${user.username}`,
                isRead: false,
                type: NotificationsEnum.friendRequest
            });
        }
    }

    async answerFriendRequest(body: CreateUsersFriends) {
        const existsFriendRequest = await this.usersFriendsModel.findOne(
            {
                $or: [
                    {
                        friend_id: body.friend_id,
                        user_id: body.user_id
                    },
                    {
                        friend_id: body.user_id,
                        user_id: body.friend_id
                    }
                ]
            }
        );

        if (existsFriendRequest.status !== UsersFriendEnum.waiting) {
            return existsFriendRequest;
        }

        const usersFriendsRequest = await this.usersFriendsModel
            .findOneAndUpdate(
                { friend_id: body.user_id, user_id: body.friend_id },
                { ...body, updated_at: new Date(this.utils.dateTimeZoneBrasil()) },
                { upsert: true }
            );

        if (
            usersFriendsRequest._id
            && body.status === UsersFriendEnum.accepted
            && usersFriendsRequest.status === UsersFriendEnum.waiting
        ) {
            const user = await this.userRepository.findOneById(body.user_id);
            this.sockerGateway.sendFriendNotifications({
                user,
                from_user_id: body.user_id,
                to_user_id: body.friend_id,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null,
                title: 'aceitou a sua solicitação de amizade.',
                url: `${process.env.FRONT_URL}perfil/${user.username}`,
                isRead: false,
                type: NotificationsEnum.friendRequest
            });
        }
    }

    async findAll(dto: GetUsersFriends, user: IAccessToken) {
        const { page, limit, ...query } = dto
        let r: any = null
        let params = null

        params = this.utils.applyFilterAggregate({ ...query, friend_id: new mongoose.Types.ObjectId(user.id) })
        params.$match = {
            ...params.$match,
            status: {
                '$ne': UsersFriendEnum.decline
            }
        }
        r = this.usersFriendsModel.aggregate([
            params,
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
            pending: result?.data.find(item => item.status === UsersFriendEnum.waiting),
            data: result?.data.map(item => {
                const [user] = item.user;

                return {
                    ...item,
                    from_user: user,
                    user: undefined,
                    title: this.getFriendNotificationTitle(item.status)
                }
            })
        }
    }

    getFriendNotificationTitle(status: UsersFriendEnum) {
        if (status === UsersFriendEnum.waiting) {
            return 'enviou uma solicitação de amizade.'
        }
        if (status === UsersFriendEnum.accepted) {
            return 'agora é seu amigo.'
        }
    }

    async findVerifyFriendShip(dto: GetUsersFriends, user: IAccessToken) {
        let r = this.usersFriendsModel.aggregate([
            {
                $match:
                {
                    $expr:
                    {
                        $or: [
                            {
                                $and:
                                    [
                                        { $eq: ["$user_id", new mongoose.Types.ObjectId(user.id)] },
                                        { $eq: ["$friend_id", new mongoose.Types.ObjectId(dto.friend_id)] }

                                    ],
                            },
                            {
                                $and:
                                    [
                                        { $eq: ["$friend_id", new mongoose.Types.ObjectId(user.id)] },
                                        { $eq: ["$user_id", new mongoose.Types.ObjectId(dto.friend_id)] }

                                    ]
                            }
                        ],


                    }
                }
            },

            {
                $lookup: {
                    from: 'users',
                    let: { user_friend: new mongoose.Types.ObjectId(dto.friend_id) },
                    pipeline: [
                        {
                            $match:
                            {
                                $expr:
                                    { $eq: ["$_id", new mongoose.Types.ObjectId(dto.friend_id)] }

                            }
                        },
                    ],
                    as: "user"
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

        ])

        const result = (await r.exec())[0]

        return {
            ...result
        }
    }
    async findOneById(id: string): Promise<UsersFriends> {
        return this.usersFriendsModel.findById(id)
    }

}