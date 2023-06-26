import { IsNotEmpty } from "class-validator";
import { PaginationPayloadDto } from "modules/utils/dto/pagination.dto";

export class GetMessages extends PaginationPayloadDto {
    @IsNotEmpty()
    user_friend_id: string

    message: string

    created_at: Date;

    updated_at: Date;

    deleted_at: Date;

    isRead?: boolean
}