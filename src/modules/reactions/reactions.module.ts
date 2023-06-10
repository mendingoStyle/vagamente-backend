import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose';
import { ReactionsValidator } from './validators/reactions.validator';
import { ReactionsRepository } from './reactions.repository';
import { ReactionsController } from './reactions.controller';
import { ReactionsService } from './reactions.service';
import { CreateReactionsUseCase } from './useCases/reactions.create.usecase';
import { GetReactionsUseCase } from './useCases/reactions.get.usecase';
import { Posts, PostsSchema, Reactions } from 'database/schemas/posts.schema';
import { ReactionsSchema } from 'database/schemas/reactions.schema';
import { NotificationsModule } from 'modules/notifications/notifications.module';
import { UsersModule } from 'modules/users/users.module';
import { PostsModule } from 'modules/posts/posts.module';


@Module({
    controllers: [ReactionsController],
    providers: [
        ReactionsValidator,
        ReactionsRepository,
        ReactionsService,
        CreateReactionsUseCase,
        GetReactionsUseCase,

    ],
    imports: [
        MongooseModule.forFeature([{ name: Reactions.name, schema: ReactionsSchema }]),
        NotificationsModule,
        UsersModule,
        PostsModule
    ],
    exports: [ReactionsService],
})
export class ReactionsModule { }
