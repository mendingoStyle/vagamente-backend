import { Transform } from "class-transformer";
import { PaginationPayloadDto } from "modules/utils/dto/pagination.dto";
import mongoose from "mongoose";

export class EditPost {
    @Transform(({ value }) => new mongoose.Types.ObjectId(value))
    _id?: mongoose.Types.ObjectId

    user_id?: string;

    deletedAt: Date

}
