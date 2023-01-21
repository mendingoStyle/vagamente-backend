import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from 'database/schemas/users.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersValidator } from './validators/users.validator';
import { UsersRepository } from './users.repository';
import { CreateUserUseCase } from './useCases/users.create.usecase';
import { GetUserUseCase } from './useCases/users.get.usecase';
import { UploadModule } from 'modules/upload/upload.module';
import { EditUserUseCase } from './useCases/users.edit.usecase';

@Module({
    controllers: [UsersController],
    providers: [
        UsersValidator,
        UsersRepository,
        UsersService,
        CreateUserUseCase,
        GetUserUseCase,
        EditUserUseCase
    ],
    imports: [
        MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
        UploadModule
    ],
    exports: [UsersService],
})
export class UsersModule { }
