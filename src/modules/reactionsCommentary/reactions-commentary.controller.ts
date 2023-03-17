import { Body, Controller, Get, Post, Query, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { GetReactionsCommentary } from "./dto/reactions.get.dto";
import { Reactions } from "database/schemas/posts.schema";
import { CreateReactionCommentary } from "./dto/reactions-commentary.create.dto";
import { LoggedUser } from "modules/utils/decorators/user.decorator";
import { IAccessToken } from "modules/auth/interfaces/jwt.interface";
import { JwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";
import { ReactionsCommentaryService } from "./reactions-commentary.service";


@Controller('reactions-commentary')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class ReactionsCommentaryController {
    constructor(private readonly service: ReactionsCommentaryService) { }

    @Post()
    create(
        @Body() dto: CreateReactionCommentary,
        @LoggedUser() user: IAccessToken,
    ) {
        return this.service.create(dto, user.id)
    }

    @Get()
    findOne(
        @Query() dto: GetReactionsCommentary
    ): Promise<Reactions[]> {
        return this.service.findAll(dto)
    }
}