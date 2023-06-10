import { PaginationPayloadDto } from "modules/utils/dto/pagination.dto";


export class GetNotifications extends PaginationPayloadDto {
    created_at: Date;

    updated_at: Date;

    deleted_at: Date;

    title: string

    url: string

    isRead: boolean

    user_id: string
}