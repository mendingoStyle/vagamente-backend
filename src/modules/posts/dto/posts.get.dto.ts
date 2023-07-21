import { Transform } from "class-transformer";
import { PaginationPayloadDto } from "modules/utils/dto/pagination.dto";
import mongoose from "mongoose";

export class GetPost extends PaginationPayloadDto {
    @Transform(({ value }) => new mongoose.Types.ObjectId(value))
    _id?: mongoose.Types.ObjectId

    title?: string;

    @Transform(({ value }) => new mongoose.Types.ObjectId(value))
    user_id?: mongoose.Types.ObjectId;

    created_at: Date;

    content_resource: string

    description:string

    updated_at: Date

    tags: string[]

    deleted_at: Date

    slug: string

    slugId: string
}
