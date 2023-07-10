import { Transform } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { PaginationPayloadDto } from "modules/utils/dto/pagination.dto";
import mongoose from "mongoose";

export class GetMessagesDto extends PaginationPayloadDto {
    @IsNotEmpty()
    @Transform(({ value }) => new mongoose.Types.ObjectId(value))
    user_friend_id: string

    message: string

    created_at: Date;

    updated_at: Date;

    deleted_at: Date;

    isRead?: boolean

    to_user_id: string

    from_user_id: string

}