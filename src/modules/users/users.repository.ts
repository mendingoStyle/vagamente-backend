import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Users, UsersDocument } from "database/schemas/users.schema";
import mongoose, { Model } from "mongoose";
import { CreateUser, EditUser } from "./dto/users.create.dto";
import { UtilsService } from "modules/utils/utils.service";
import { IUserValidateExists } from "modules/utils/dto/user.interface";
import { Badges, BadgesDocument } from "database/schemas/badges.schema";
import { BadgesService } from "modules/badges/badges.service";


@Injectable()
export class UsersRepository {
    constructor(
        @InjectModel(Users.name) private usersModel: Model<UsersDocument>,
        private readonly utils: UtilsService,
        private readonly badgesService: BadgesService
    ) { }
    async create(body: CreateUser) {

        const userModel = new this.usersModel({ ...body, firstLogin: true });
        await this.badgesService.createFirstLoginBadge(userModel._id)
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
    async findOneByEmailOrUsername(dto: { email?: string, username: string }, userId: string) {
        return this.usersModel.findOne()
            .where({
                "$or": [
                    { username: dto.username },
                    { email: dto.email }
                ],
                _id: { "$ne": new mongoose.Types.ObjectId(userId) }

            })
            .exec()
    }
    async findOneByEmailOrUsernameBoolean(dto: { email: string, username: string }, userId: string) {
        const user = await this.usersModel.findOne()
            .where({
                "$or": [
                    { username: dto.username },
                    { email: dto.email },

                ],
                _id: { "$ne": new mongoose.Types.ObjectId(userId) }

            })
            .exec()
        return {
            exist: !!user
        }
    }
    async patch(body: EditUser) {
        await this.usersModel.findOneAndUpdate(
            { _id: body._id },
            { ...body, updated_at: new Date(this.utils.dateTimeZoneBrasil()) },
            { upsert: true, new: false });
        return {
            message: 'Usuário Alterado!'
        }
    }

    async validateIfNotExists(
        validateObjects: IUserValidateExists[],
    ): Promise<Users> {
        for (const validate of validateObjects) {
            const { key, value, errorMessage } = validate
            const user = (await this.findAll({
                [key]: value,
            }))[0]
            if (!user) throw this.utils.throwErrorBadReqException(errorMessage)
            return user
        }
    }
    topUsers() {
        return this.usersModel.aggregate([
            {
                $lookup: {
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'posts',
                }
            },
            {
                $lookup: {
                    from: 'reactions',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'reactions',
                },
            },
            {
                $lookup: {
                    from: 'commentaries',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'commentaries',
                },
            },
            {
                $addFields: { commentaries_count: { $size: "$commentaries" } }
            },
            {
                $addFields: { reactions_count: { $size: "$reactions" } }
            },
            {
                $addFields: { posts_count: { $size: "$posts" } }
            },
            {
                $project: {
                    'commentaries': 0,
                    reactions: 0,
                    posts: 0,
                    email: 0,
                    password: 0,
                }
            },
            {
                "$addFields": {
                    "moviments": {
                        $sum: ["$commentaries_count", "$reactions_count", "$posts_count"]
                    }
                }
            },
            {
                $sort: {
                    moviments: -1,
                    _id: -1
                }
            },
            {
                '$facet': {
                    data: [{ $limit: 10 }] // add projection here wish you re-shape the docs
                }
            }
        ])

    }


}