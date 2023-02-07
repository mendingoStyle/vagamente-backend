import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose';
import { UsersBadges, UsersBadgesSchema } from 'database/schemas/users_badges.schema';
import { BadgesService } from './badges.service';
import { Badges, BadgesSchema } from 'database/schemas/badges.schema';
require('dotenv').config()

@Module({
    controllers: [],
    providers: [
        BadgesService,
    ],
    imports: [
        MongooseModule.forFeature([
            { name: Badges.name, schema: BadgesSchema },
            { name: UsersBadges.name, schema: UsersBadgesSchema }
        ]),

    ],
    exports: [BadgesService],
})
export class BadgesModule { }
