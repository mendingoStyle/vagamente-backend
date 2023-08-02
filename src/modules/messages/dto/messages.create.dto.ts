import { IsNotEmpty } from "class-validator";

export class CreateMessagesDto {
    @IsNotEmpty()
    user_friend_id: string

    @IsNotEmpty()
    message: string | Buffer

    created_at: Date;

    updated_at: Date;

    deleted_at: Date;

    isRead?: boolean

    to_user_id: string

    from_user_id: string

}