import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Messages, MessagesSchema } from "database/schemas/messages.schema";
import { MessagesController } from "./messages.controller";
import { MessagesService } from "./messages.service";
import { UsersFriendsModule } from "modules/usersFriends/usersFriends.module";
import { SocketModule } from "modules/socket/socket.module";
import { UserKeysModule } from "modules/userKeys/userKeys.module";


@Module({
    controllers: [MessagesController],
    providers: [
        MessagesService
    ],
    imports: [
        MongooseModule.forFeature([{ name: Messages.name, schema: MessagesSchema }]),
        UsersFriendsModule,
        SocketModule,
        UserKeysModule
    ],
    exports: [MessagesService],
})
export class MessagesModule { }
