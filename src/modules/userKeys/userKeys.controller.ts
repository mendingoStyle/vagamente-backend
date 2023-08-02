import { Body, Controller, Get, Post, Query, UseGuards, UsePipes, ValidationPipe, Headers } from "@nestjs/common";
import { UserKeysService } from "./userKeys.service";


@Controller('keys')
@UsePipes(new ValidationPipe({ transform: true }))
export class UserKeysController {
    constructor(
        private readonly service: UserKeysService
    ) { }

    @Get()
    createOrGet(@Query('user_id') user_id: string) {
        return this.service.createKeys(user_id)
    }


}