import { Prop, Schema } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { UsersFriends } from "./users_friends.schema";

@Schema()
export class Messages {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: UsersFriends.name
    })
    user_friend_id: mongoose.Schema.Types.ObjectId

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