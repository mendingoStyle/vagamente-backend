import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose';
import { UserKeysController } from './userKeys.controller';
import { UserKeysService } from './userKeys.service';
import { UserKeys, UserKeysSchema } from 'database/schemas/user_keys.schema';

@Module({
    controllers: [UserKeysController],
    providers: [
        UserKeysService
    ],
    imports: [
        MongooseModule.forFeature([{ name: UserKeys.name, schema: UserKeysSchema }]),
    ],
    exports: [UserKeysService],
})
export class UserKeysModule { }
