import { NotificationsEnum } from "database/schemas/notifications.schema";
import { PaginationPayloadDto } from "modules/utils/dto/pagination.dto";

export class GetUsersFriends extends PaginationPayloadDto {
    user_id: string

    friend_id: string

    status: NotificationsEnum

    created_at: Date;

    updated_at: Date;

    deleted_at: Date;
}