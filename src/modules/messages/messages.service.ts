import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Messages, MessagesDocument } from "database/schemas/messages.schema";
import { UtilsService } from "modules/utils/utils.service";
import mongoose, { Model } from "mongoose";
import { GetMessagesDto } from "./dto/messages.get.dto";
import { IAccessToken } from "modules/auth/interfaces/jwt.interface";
import { CreateMessagesDto } from "./dto/messages.create.dto";

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(Messages.name) private messagesModel: Model<MessagesDocument>,
        private readonly utils: UtilsService
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
                $match: {
                    "friends.user_id": new mongoose.Types.ObjectId(user.id)
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

    async create(body:CreateMessagesDto, userId: string){
        body.from_user_id = userId
        return this.messagesModel.create(
            {
                ...body, 
                created_at: new Date(),
                updated_at: new Date(), 
                deleted_at: null,
                isRead: false
            })
    }
}