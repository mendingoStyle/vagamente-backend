import { IsNotEmpty } from "@nestjs/class-validator";


export class CreatePost {
    @IsNotEmpty()
    title?: string;

    user_id?: string

    created_at: Date;

    content_resource: string

    description: string;

    updated_at: Date

    tags: any

    isAnonymous: boolean

    slug?: string
}
