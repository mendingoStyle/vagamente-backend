import { PaginationPayloadDto } from "modules/utils/dto/pagination.dto";
import mongoose from "mongoose";

export class GetCommentary extends PaginationPayloadDto {
    _id?: string

    commentary?: string;

    user_id?: string

    post_id: string

    created_at: Date;

    updated_at: Date;

    deleted_at: Date;

    answer_id: string

}
