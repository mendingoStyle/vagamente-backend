import { Module } from '@nestjs/common'
import { UsersSocket, UsersSocketSchema } from 'database/schemas/users_socket.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSocketService } from './usersSocket.service';


@Module({
    exports: [
        UsersSocketService
    ],
    providers: [
        UsersSocketService
    ],
    imports: [
        MongooseModule.forFeature([{ name: UsersSocket.name, schema: UsersSocketSchema }]),
    ],
})
export class UsersSocketModule { }
