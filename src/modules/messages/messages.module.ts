import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Messages, MessagesSchema } from "database/schemas/messages.schema";
import { MessagesController } from "./messages.controller";
import { MessagesService } from "./messages.service";


@Module({
    controllers: [MessagesController],
    providers: [
        MessagesService
    ],
    imports: [
        MongooseModule.forFeature([{ name: Messages.name, schema: MessagesSchema }]),
    ],
    exports: [MessagesService],
})
export class MessagesModule { }
