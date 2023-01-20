import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUser } from "./dto/users.create.dto";
import { GetUser } from "./dto/users.get.dto";
import { Users } from "database/schemas/users.schema";


@Controller('users')
@UsePipes(new ValidationPipe({ transform: true }))
export class UsersController {
    constructor(
        private readonly service: UsersService
    ) { }

    @Post()
    create(
        @Body() dto: CreateUser,
    ) {
        return this.service.create(dto)
    }

    @Get()
    findOne(
        @Query() dto: GetUser
    ): Promise<Users[]> {
        return this.service.findAll(dto)
    }
    
}