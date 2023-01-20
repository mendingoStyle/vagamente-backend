import { Body, Controller, Get, Post, Query, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { GetReactions } from "./dto/reactions.get.dto";
import { ReactionsService } from "./reactions.service";
import { Reactions } from "database/schemas/posts.schema";
import { CreateReaction } from "./dto/reactions.create.dto";
import { LoggedUser } from "modules/utils/decorators/user.decorator";
import { IAccessToken } from "modules/auth/interfaces/jwt.interface";
import { JwtAuthGuard } from "modules/auth/jwt-auth.guard";


@Controller('reactions')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class ReactionsController {
    constructor(private readonly service: ReactionsService) { }

    @Post()
    create(
        @Body() dto: CreateReaction,
        @LoggedUser() user: IAccessToken,
    ) {
        return this.service.create(dto, user.id)
    }

    @Get()
    findOne(
        @Query() dto: GetReactions
    ): Promise<Reactions[]> {
        return this.service.findAll(dto)
    }
}