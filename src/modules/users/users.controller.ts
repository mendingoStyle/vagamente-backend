import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUser } from "./dto/users.create.dto";
import { GetUser } from "./dto/users.get.dto";
import { Users } from "database/schemas/users.schema";
import { FileInterceptor } from "@nestjs/platform-express";


@Controller('users')
@UsePipes(new ValidationPipe({ transform: true }))
export class UsersController {
    constructor(
        private readonly service: UsersService
    ) { }

    @UseInterceptors(FileInterceptor('file'))
    @Post()
    create(
        @Body() dto: CreateUser,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.service.create(dto, file)
    }


    findOne(
        @Query() dto: GetUser
    ): Promise<Users[]> {
        return this.service.findAll(dto)
    }

}