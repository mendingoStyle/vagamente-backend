import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from 'database/schemas/users.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersValidator } from './validators/users.validator';
import { UsersRepository } from './users.repository';
import { CreateUserUseCase } from './useCases/users.create.usecase';
import { GetUserUseCase } from './useCases/users.get.usecase';

@Module({
    controllers: [UsersController],
    providers: [
        UsersValidator,
        UsersRepository,
        UsersService,
        CreateUserUseCase,
        GetUserUseCase
    ],
    imports: [
        MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
    ],
    exports: [UsersService],
})
export class UsersModule { }
