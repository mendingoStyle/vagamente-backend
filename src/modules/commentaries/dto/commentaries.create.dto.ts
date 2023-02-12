import { IsNotEmpty } from "@nestjs/class-validator";
import mongoose from "mongoose";

export class CreateCommentary {
    _id?: string

    @IsNotEmpty()
    commentary?: string;

    user_id?: string

    post_id: string

    answer_id: string

    created_at: Date;

    updated_at: Date;

    deleted_at: Date;

    counter: number
}
