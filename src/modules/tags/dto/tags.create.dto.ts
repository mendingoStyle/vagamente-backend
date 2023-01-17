import { IsNotEmpty } from "@nestjs/class-validator";

export class CreateTags {
    title?: string;
    created_at?: string
    updated_at?: string
}
