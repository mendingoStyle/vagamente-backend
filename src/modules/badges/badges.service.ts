import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Badges, BadgesDocument } from "database/schemas/badges.schema";
import { UsersBadges, UsersBadgesDocument } from "database/schemas/users_badges.schema";
import { UtilsService } from "modules/utils/utils.service";
import { Model } from "mongoose";

@Injectable()
export class BadgesService {
    constructor(
        @InjectModel(Badges.name) private badgesModel: Model<BadgesDocument>,
        @InjectModel(UsersBadges.name) private UsersBadgesModel: Model<UsersBadgesDocument>,
        private readonly utils: UtilsService
    ) { }
    async createFirstLoginBadge(user_id: string) {
        const badge = await this.findFirstBadge()
        if (badge)
            await new this.UsersBadgesModel(
                {
                    user_id: user_id, badge_id: badge._id,
                    created_at: new Date(this.utils.dateTimeZoneBrasil())
                }
            )
                .save()

    }
    async findFirstBadge() {
        const badges = await this.badgesModel
            .find()
            .where("category").equals('login_consecutive')
            .where("level").equals('1')
            .exec()
        if (!(badges.length > 0)) return null
        return badges[0]
    }
}
