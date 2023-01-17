import { PaginationPayloadDto } from "modules/utils/dto/pagination.dto";

export class GetPost extends PaginationPayloadDto {
    _id?: string

    title?: string;

    user_id?: number;

    created_at: Date;

    content_resource: string

    updated_at: Date

    tags: string[]
}
