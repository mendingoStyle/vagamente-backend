
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Users } from './users.schema';
import { Badges } from './badges.schema';

export type UsersBadgesDocument = HydratedDocument<UsersBadges>;

@Schema()
export class UsersBadges {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Users.name
    })
    user_id: mongoose.Schema.Types.ObjectId;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Badges.name
    })
    badge_id: mongoose.Schema.Types.ObjectId

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;

    @Prop()
    deleted_at: Date;
}

export const UsersBadgesSchema = SchemaFactory.createForClass(UsersBadges);