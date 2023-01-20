import { PaginationPayloadDto } from "modules/utils/dto/pagination.dto";

export class GetUser extends PaginationPayloadDto {
    _id?: string;

    name?: string;

    birth_date?: Date;

    password?: Date;

    email?: string;

    avatar?: string;

    username?: string;

    created_at?: Date;

    updated_at?: Date;

    deleted_at?: Date;
}
