import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { createPost } from "./dto/posts.create.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('posts')
export class PostsController {
    constructor(private readonly service: PostsService) { }

    @UseInterceptors(FileInterceptor('file'))
    @Post()
    create(
        @Body() dto: createPost,
        @UploadedFile()
        file: Express.Multer.File
    ): Promise<any> {
        return this.service.create(dto, file)
    }

    @Get()
    findOne(): Promise<any> {
        return this.service.findAll()
    }
}