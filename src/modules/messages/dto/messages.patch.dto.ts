import { Transform } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class ReadAllMessagesDto {
    @IsNotEmpty()
    @Transform(({ value }) => new mongoose.Types.ObjectId(value))
    user_friend_id: string

}