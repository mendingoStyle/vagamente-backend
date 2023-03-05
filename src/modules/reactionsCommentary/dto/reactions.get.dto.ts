import { ReactionsEnum } from "database/schemas/reactions.schema";
import { PaginationPayloadDto } from "modules/utils/dto/pagination.dto";

export class GetReactions extends PaginationPayloadDto {
    _id: string

    commentary_id: string

    type: ReactionsEnum

    user_id: string;

    created_at: Date;

    updated_at: Date;

    deleted_at: Date;
}
