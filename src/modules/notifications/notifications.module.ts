import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose';
import { Notifications, NotificationsSchema } from 'database/schemas/notifications.schema';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { SocketModule } from 'modules/socket/socket.module';


@Module({
    exports: [NotificationsService],
    providers: [
        NotificationsService
    ],
    imports: [
        MongooseModule.forFeature([{ name: Notifications.name, schema: NotificationsSchema }]),
        SocketModule
    ],
    controllers: [
        NotificationsController
    ]
})
export class NotificationsModule { }
