import { Transform } from "class-transformer";
import { PaginationPayloadDto } from "modules/utils/dto/pagination.dto";
import mongoose from "mongoose";

export class GetCommentary extends PaginationPayloadDto {
    _id?: string

    commentary?: string;

    user_id?: string

    @Transform(({ value }) => new mongoose.Types.ObjectId(value))
    post_id: mongoose.Types.ObjectId

    created_at: Date;

    updated_at: Date;

    deleted_at: Date;

    @Transform(({ value }) => new mongoose.Types.ObjectId(value))
    answer_id: mongoose.Types.ObjectId



}
