import { NotificationsEnum } from "database/schemas/notifications.schema";
import { Users } from "database/schemas/users.schema";
import { ObjectId } from "mongoose";


export class SendNotificationsDto {
    created_at: Date;

    updated_at: Date;

    deleted_at: Date;

    title: string

    url: string

    isRead: boolean

    to_user_id: string | ObjectId

    from_user_id: string | ObjectId

    user: Users

    type: NotificationsEnum
}