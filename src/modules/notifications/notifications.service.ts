import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Notifications, NotificationsDocument } from "database/schemas/notifications.schema";
import { UtilsService } from "modules/utils/utils.service";
import mongoose, { Model } from "mongoose";
import { CreateNotifications } from "./dto/notifications.create";
import { GetNotifications } from "./dto/notifications.get";
import { IAccessToken } from "modules/auth/interfaces/jwt.interface";
import { EditNotifications } from "./dto/notifications.edit";
import { SocketGateway } from "modules/socket/socket.gateway";
import { Users } from "database/schemas/users.schema";

@Injectable()
export class NotificationsService {
    constructor(
        @InjectModel(Notifications.name) private noficationsModel: Model<NotificationsDocument>,
        private utils: UtilsService,
        private sockerGateway: SocketGateway,
    ) { }

    async create(dto: CreateNotifications, user: Users) {
        const notifications = await this.noficationsModel.create(dto)
        if (notifications)
            this.sockerGateway.sendNotifications({ ...dto, user })
        return notifications
    }

    edit(body: EditNotifications, user: IAccessToken) {
        return this.noficationsModel.updateMany(
            {
                user_id: user.id
            },
            {
                ...body
            })
    }


    async findAll(dto: GetNotifications, user_id: string) {
        const { page, limit, ...query } = dto
        let r: any = null
        let params = null

        params = this.utils.applyFilterAggregate({ to_user_id: new mongoose.Types.ObjectId(user_id) })

        r = this.noficationsModel.aggregate([
            params,
            {
                $lookup: {
                    from: 'users',
                    localField: 'to_user_id',
                    foreignField: '_id',
                    as: 'to_user',
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
                "$addFields": {
                    "to_user.password": {
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
                    data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
                    isAllRead: [
                        { $match: { isRead: false } },
                    ],
                    totalCount: [
                        {
                            $count: 'count'
                        }
                    ]

                }
            }
        ])
        let result = (await r.exec())[0]
        if (result.data)
            result.data = result?.data.map(r => {
                return {
                    ...r,
                    from_user: r?.from_user[0],
                    to_user: r?.to_user[0]
                }
            })
        return {
            total: result?.totalCount[0]?.count,
            pending: result?.isAllRead?.length > 0,
            data: result?.data
        }
    }
}