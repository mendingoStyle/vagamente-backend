import { PaginationPayloadDto } from "modules/utils/dto/pagination.dto";

export class GetTag extends PaginationPayloadDto {
    _id?: string
    title?: string;
    created_at: Date;
}
