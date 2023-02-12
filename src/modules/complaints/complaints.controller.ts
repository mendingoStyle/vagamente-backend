import { Body, Controller, Get, Post, Query, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { LoggedUser } from "modules/utils/decorators/user.decorator";
import { IAccessToken } from "modules/auth/interfaces/jwt.interface";
import { JwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";
import { CreateComplaint } from "./dto/complaints.create.dto";
import { ComplaintsService } from "./complaints.service";
import { GetComplaint } from "./dto/complaints.get.dto";
import { Complaints } from "database/schemas/complaints.schema";


@Controller('complaints')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class ComplaintsController {
    constructor(private readonly service: ComplaintsService) { }

    @Post()
    create(
        @Body() dto: CreateComplaint,
        @LoggedUser() user: IAccessToken,
    ) {
        return this.service.create(dto, user.id)
    }

    @Get()
    findOne(
        @Query() dto: GetComplaint
    ): Promise<Complaints[]> {
        return this.service.findAll(dto)
    }
}