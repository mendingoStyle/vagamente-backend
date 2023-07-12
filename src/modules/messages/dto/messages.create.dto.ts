import { IsNotEmpty } from "class-validator";

export class CreateMessagesDto {
    @IsNotEmpty()
    user_friend_id: string

    @IsNotEmpty()
    message: string

    created_at: Date;

    updated_at: Date;

    deleted_at: Date;

    isRead?: boolean

    from_user_id: string

    @IsNotEmpty()
    to_user_id: string
}