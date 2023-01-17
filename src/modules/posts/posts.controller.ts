import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePost } from "./dto/posts.create.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { GetPost } from "./dto/posts.get.dto";

@Controller('posts')
@UsePipes(new ValidationPipe({ transform: true }))
export class PostsController {
    constructor(private readonly service: PostsService) { }

    @UseInterceptors(FileInterceptor('file'))
    @Post()
    create(
        @Body() dto: CreatePost,
        @UploadedFile()
        file: Express.Multer.File
    ): Promise<any> {
        return this.service.create(dto, file)
    }

    @Get()
    findAll(
        @Query() dto: GetPost
    ): Promise<any> {
        return this.service.findAll(dto)
    }

    @Get('post-by/tags')
    findCategories(
        @Query() dto: GetPost
    ): Promise<any> {
        return this.service.findCategories()
    }
}