import { Body, Controller, Get, Post, Query, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { UsersFriendsService } from "./usersFriends.service";
import { CreateUsersFriends } from "./dto/usersFriends.create.dto";
import { LoggedUser } from "modules/utils/decorators/user.decorator";
import { IAccessToken } from "modules/auth/interfaces/jwt.interface";
import { GetUsersFriends } from "./dto/usersFriends.get.dto";
import { JwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('friendship')
@UsePipes(new ValidationPipe({ transform: true }))
export class UsersFriendsController {
    constructor(
        private readonly service: UsersFriendsService
    ) { }

    @Post()
    create(
        @Body() dto: CreateUsersFriends,
        @LoggedUser() user: IAccessToken,
    ) {
        return this.service.create({ ...dto, user_id: user.id })
    }

    @Get()
    findAll(
        @Query() dto: GetUsersFriends,
        @LoggedUser() user: IAccessToken,
    ) {
        return this.service.findAll(dto, user)
    }
}