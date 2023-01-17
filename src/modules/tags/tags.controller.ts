import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { TagsService } from "./tags.service";
import { CreateTags } from "./dto/tags.create.dto";
import { GetTag } from "./dto/tags.get.dto";
import { Tags } from "database/schemas/tags.schema";


@Controller('tags')
@UsePipes(new ValidationPipe({ transform: true }))
export class TagsController {
    constructor(private readonly service: TagsService) { }

    @Post()
    create(
        @Body() dto: CreateTags,
    ) {
        return this.service.create(dto)
    }

    @Get()
    findOne(
        @Query() dto: GetTag
    ): Promise<Tags[]> {
        return this.service.findAll(dto)
    }
}