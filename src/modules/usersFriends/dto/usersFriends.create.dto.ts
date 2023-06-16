import { IsNotEmpty } from "class-validator";
import { NotificationsEnum } from "database/schemas/notifications.schema";

export class CreateUsersFriends {
    user_id: string

    @IsNotEmpty()
    friend_id: string

    @IsNotEmpty()
    status: NotificationsEnum

    created_at: Date;

    updated_at: Date;

    deleted_at: Date;
}