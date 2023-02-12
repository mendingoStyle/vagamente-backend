import { IsNotEmpty } from "@nestjs/class-validator";


export class CreateComplaint {
    post_id: string

    user_id: string;

    commentary_id: string

    created_at: Date;

    deleted_at: Date;

    @IsNotEmpty()
    reason: string

}
