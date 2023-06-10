
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Users } from './users.schema';
import { Badges } from './badges.schema';

export type UsersFriendsDocument = HydratedDocument<UsersFriends>;
export enum NotificationsEnum {
    waiting = 'waiting',
    accepted = 'accepted',
    decline = 'decline'
}
@Schema()
export class UsersFriends {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Users.name
    })
    user_id: mongoose.Schema.Types.ObjectId;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Users.name
    })
    friend_id: mongoose.Schema.Types.ObjectId

    @Prop()
    status: NotificationsEnum

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;

    @Prop()
    deleted_at: Date;
}

export const UsersFriendsSchema = SchemaFactory.createForClass(UsersFriends);