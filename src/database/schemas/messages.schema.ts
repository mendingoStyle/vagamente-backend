import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { UsersFriends } from "./users_friends.schema";
import { Users } from "./users.schema";

export type MessagesDocument = HydratedDocument<Messages>;

@Schema()
export class Messages {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: UsersFriends.name
    })
    user_friend_id: mongoose.Schema.Types.ObjectId

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Users.name
    })
    to_user_id: mongoose.Schema.Types.ObjectId

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Users.name
    })
    from_user_id: mongoose.Schema.Types.ObjectId

    @Prop()
    message: string

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;

    @Prop()
    deleted_at: Date;

    @Prop()
    isRead?: boolean

}
export const MessagesSchema = SchemaFactory.createForClass(Messages);