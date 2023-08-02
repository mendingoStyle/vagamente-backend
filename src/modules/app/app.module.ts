import { Module } from '@nestjs/common'
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from 'modules/posts/posts.module';
import { UploadModule } from 'modules/upload/upload.module';
import { TagsModule } from 'modules/tags/tags.module';
import { UtilsModule } from 'modules/utils/utils.module';
import { TokenModule } from 'modules/token/tokenController.module';
import { AuthModule } from 'modules/auth/auth.module';
import { ReactionsModule } from 'modules/reactions/reactions.module';
import { CommentariesModule } from 'modules/commentaries/commentaries.module';
import { BadgesModule } from 'modules/badges/badges.module';
import { ComplaintsModule } from 'modules/complaints/complaints.module';
import { ReactionsCommentaryModule } from 'modules/reactionsCommentary/reactions-commentary.module';
import { SocketModule } from 'modules/socket/socket.module';
import { UsersSocketModule } from 'modules/usersSocket/usersSocket.module';
import { NotificationsModule } from 'modules/notifications/notifications.module';
import { UsersFriendsModule } from 'modules/usersFriends/usersFriends.module';
import { MessagesModule } from 'modules/messages/messages.module';
import { UserKeysModule } from 'modules/userKeys/userKeys.module';
require('dotenv').config()

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${process.env.DB_USERNAME_ADMIN}:${process.env.DB_PASSWORD_ADMIN}@${process.env.DATABASE_IP}:27017/${process.env.DATABASE}`,),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PostsModule,
    UploadModule,
    TagsModule,
    UtilsModule,
    TokenModule,
    AuthModule,
    ReactionsModule,
    CommentariesModule,
    BadgesModule,
    ComplaintsModule,
    ReactionsCommentaryModule,
    SocketModule,
    UsersSocketModule,
    NotificationsModule,
    UsersFriendsModule,
    MessagesModule,
    UserKeysModule
  ],
  controllers: [AppController],
})

export class AppModule { }
