import { Body, Patch, Headers, Controller, UseGuards, Get, Post, Query, UploadedFile, UseInterceptors, UsePipes, ValidationPipe, ParseFilePipeBuilder, HttpStatus } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePost } from "./dto/posts.create.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { GetPost } from "./dto/posts.get.dto";
import { EditPost } from "./dto/posts.edit.dto";
import { JwtAuthGuard } from "modules/auth/jwt-auth.guard";
import { LoggedUser } from "modules/utils/decorators/user.decorator";
import { IAccessToken } from "modules/auth/interfaces/jwt.interface";

@Controller('posts')
@UsePipes(new ValidationPipe({ transform: true }))
export class PostsController {
    constructor(private readonly service: PostsService) { }

    @UseInterceptors(FileInterceptor('file'))
    @Post()
    create(
        @Body() dto: CreatePost,
        @UploadedFile(new ParseFilePipeBuilder()
            .addFileTypeValidator({
                fileType: '^.*\.(jpg|JPG|gif|png|mp4|jpeg|JPEG|webp)$',
            })
            .addMaxSizeValidator({
                maxSize: 100000
            })
            .build({
                errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                fileIsRequired: false
            })) file: Express.Multer.File,
        @Headers('authorization') token: string,
    ): Promise<any> {
        return this.service.create(dto, file, token)
    }

    @Get()
    findAll(
        @Query() dto: GetPost,
        @Headers('authorization') token: string,
    ): Promise<any> {
        return this.service.findAll(dto, token)
    }

    @Get('hot')
    findHot(
        @Query() dto: GetPost,
        @Headers('authorization') token: string,
    ): Promise<any> {
        return this.service.findHot(dto, token)
    }

    @Get('trending')
    findTrending(
        @Query() dto: GetPost,
        @Headers('authorization') token: string,
    ): Promise<any> {
        return this.service.findTrending(dto, token)
    }

    @Get('post-by/tags')
    findCategories(
        @Query() dto: GetPost
    ): Promise<any> {
        return this.service.findCategories()
    }

    @UseGuards(JwtAuthGuard)
    @Patch()
    edit(
        @Query() dto: EditPost,
        @LoggedUser() user: IAccessToken,
    ): Promise<any> {
        return this.service.edit(dto, user)
    }
}