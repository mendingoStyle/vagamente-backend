import { IsNotEmpty } from "@nestjs/class-validator";
import mongoose from "mongoose";

export class CreatePost {
    @IsNotEmpty()
    title?: string;

    user_id?: string

    created_at: Date;

    content_resource: string

    updated_at: Date

    tags: any

    isAnonymous: boolean
}
