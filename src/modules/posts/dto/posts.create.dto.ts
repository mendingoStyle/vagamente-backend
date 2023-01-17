import { IsNotEmpty } from "@nestjs/class-validator";

export class CreatePost {
    _id?: string

    @IsNotEmpty()
    title?: string;

    user_id?: number;

    created_at: Date;

    content_resource: string

    updated_at: Date

    tags: any
}
