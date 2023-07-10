import { Body, Controller, Get, Post, Query, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { IAccessToken } from "modules/auth/interfaces/jwt.interface";
import { LoggedUser } from "modules/utils/decorators/user.decorator";
import { GetMessagesDto } from "./dto/messages.get.dto";
import { JwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";
import { CreateMessagesDto } from "./dto/messages.create.dto";

@Controller('messages')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class MessagesController {
    constructor(
        private readonly service: MessagesService
    ) { }

    @Get()
    find(
        @Query() dto: GetMessagesDto,
        @LoggedUser() user: IAccessToken,
    ) {
        return this.service.findAll(dto, user)
    }
     @Post()
    create(
        @Body() dto: CreateMessagesDto,
        @LoggedUser() user: IAccessToken,
    ) {
        return this.service.create(dto, user.id)
    }


}