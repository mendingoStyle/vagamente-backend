import { IsNotEmpty } from "class-validator";
import { UsersFriendEnum } from "database/schemas/users_friends.schema";

export class CreateUsersFriends {
    user_id: string

    @IsNotEmpty()
    friend_id: string

    @IsNotEmpty()
    status: UsersFriendEnum

    created_at: Date;

    updated_at: Date;

    deleted_at: Date;
}