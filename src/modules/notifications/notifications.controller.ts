import { Body, Controller, Get, Patch, Query, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { JwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";
import { GetNotifications } from "./dto/notifications.get";
import { NotificationsService } from "./notifications.service";
import { Notifications } from "database/schemas/notifications.schema";
import { LoggedUser } from "modules/utils/decorators/user.decorator";
import { IAccessToken } from "modules/auth/interfaces/jwt.interface";
import { EditNotifications } from "./dto/notifications.edit";



@Controller('notification')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class NotificationsController {
    constructor(private readonly service: NotificationsService) { }

    @Get()
    findOne(
        @Query() dto: GetNotifications,
        @LoggedUser() user: IAccessToken,
    ) {
        return this.service.findAll(dto, user.id)
    }

    @Patch()
    edit(
        @Body() body: EditNotifications,
        @LoggedUser() user: IAccessToken
    ) {
        return this.service.edit(body, user)
    }

}