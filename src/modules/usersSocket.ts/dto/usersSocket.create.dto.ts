import { IsNotEmpty } from "@nestjs/class-validator";

export class CreateUsersSocket {
    user_id: string | string[]; 
    socket_id: string
}
