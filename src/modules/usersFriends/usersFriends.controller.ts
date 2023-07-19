import { Body, Controller, Get, Post, Query, UseGuards, UsePipes, ValidationPipe, Headers } from "@nestjs/common";
import { UsersFriendsService } from "./usersFriends.service";
import { CreateUsersFriends } from "./dto/usersFriends.create.dto";
import { LoggedUser } from "modules/utils/decorators/user.decorator";
import { IAccessToken } from "modules/auth/interfaces/jwt.interface";
import { GetUsersFriends } from "./dto/usersFriends.get.dto";
import { JwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";

@Controller('friendship')
@UsePipes(new ValidationPipe({ transform: true }))
export class UsersFriendsController {
    constructor(
        private readonly service: UsersFriendsService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(
        @Body() dto: CreateUsersFriends,
        @LoggedUser() user: IAccessToken,
    ) {
        return this.service.sendFriendRequest({ ...dto, user_id: user.id })
    }

    @UseGuards(JwtAuthGuard)
    @Post('answer')
    answerFriendRequest(
        @Body() dto: CreateUsersFriends,
        @LoggedUser() user: IAccessToken,
        
    ) {
        return this.service.answerFriendRequest({ ...dto, user_id: user.id })
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAllRequests(
        @Query() dto: GetUsersFriends,
        @LoggedUser() user: IAccessToken,
    ) {
        return this.service.findAllRequests(dto, user)
    }

    @Get('find-friends')
    findAll(
        @Query() dto: GetUsersFriends,
        @Headers('authorization') token: string,
    ) {
        return this.service.findAll(dto, token)
    }

    @UseGuards(JwtAuthGuard)
    @Get('verify')
    findIsFriend(
        @Query() dto: GetUsersFriends,
        @LoggedUser() user: IAccessToken,
    ) {
        return this.service.findVerifyFriendShip(dto, user)
    }

}