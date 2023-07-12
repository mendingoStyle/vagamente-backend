import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Messages, MessagesSchema } from "database/schemas/messages.schema";
import { MessagesController } from "./messages.controller";
import { MessagesService } from "./messages.service";
import { UsersFriendsModule } from "modules/usersFriends/usersFriends.module";


@Module({
    controllers: [MessagesController],
    providers: [
        MessagesService
    ],
    imports: [
        MongooseModule.forFeature([{ name: Messages.name, schema: MessagesSchema }]),
        UsersFriendsModule
    ],
    exports: [MessagesService],
})
export class MessagesModule { }
