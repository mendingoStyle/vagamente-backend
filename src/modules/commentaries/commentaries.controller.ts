import { Body, Controller, Get, Post, Query, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CommentariesService } from "./commentaries.service";
import { CreateCommentary } from "./dto/commentaries.create.dto";
import { IAccessToken } from "modules/auth/interfaces/jwt.interface";
import { LoggedUser } from "modules/utils/decorators/user.decorator";
import { GetCommentary } from "./dto/commentaries.get.dto";
import { JwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";

@Controller('commentaries')
@UsePipes(new ValidationPipe({ transform: true }))
export class CommentariesController {
    constructor(private readonly service: CommentariesService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(
        @Body() dto: CreateCommentary,
        @LoggedUser() user: IAccessToken,
    ) {
        return this.service.create(dto, user.id)
    }

    @Get()
    findAll(
        @Query() dto: GetCommentary,
    ): Promise<any> {
        return this.service.findAll(dto)
    }

}