import { Module } from '@nestjs/common'
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from 'modules/posts/posts.module';
import { UploadModule } from 'modules/upload/upload.module';
require('dotenv').config()
@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${process.env.DB_USERNAME_ADMIN}:${process.env.DB_PASSWORD_ADMIN}@localhost:27017/${process.env.DATABASE}`,),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PostsModule,
    UploadModule,
  ],
  controllers: [AppController],
})

export class AppModule { }
