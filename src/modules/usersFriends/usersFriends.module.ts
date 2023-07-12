import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose';
import { UsersFriendsController } from './usersFriends.controller';
import { UsersFriendsService } from './usersFriends.service';
import { UsersFriends, UsersFriendsSchema } from 'database/schemas/users_friends.schema';
import { UsersModule } from 'modules/users/users.module';
import { SocketModule } from 'modules/socket/socket.module';

@Module({
    controllers: [UsersFriendsController],
    providers: [
        UsersFriendsService
    ],
    imports: [
        MongooseModule.forFeature([{ name: UsersFriends.name, schema: UsersFriendsSchema }]),
        UsersModule,
        SocketModule
    ],
    exports: [UsersFriendsService],
})
export class UsersFriendsModule { }
