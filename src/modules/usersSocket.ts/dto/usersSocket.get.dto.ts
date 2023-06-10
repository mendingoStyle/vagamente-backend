import { ObjectId } from "mongoose"

export class GetUsersSocket {
    user_id: string | ObjectId
    socket_id?: string
}
