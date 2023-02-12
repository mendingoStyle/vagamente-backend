import { IsNotEmpty } from "@nestjs/class-validator";
import { PaginationPayloadDto } from "modules/utils/dto/pagination.dto";


export class GetComplaint extends PaginationPayloadDto {
    post_id: string

    user_id: string;

    commentary_id: string

    created_at: Date;

    deleted_at: Date;

    reason: string
}
