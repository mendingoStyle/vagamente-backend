import { Body, Controller, Get, Patch, Post, Query, UploadedFile, Headers, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUser, EditUser } from "./dto/users.create.dto";
import { GetUser } from "./dto/users.get.dto";
import { Users } from "database/schemas/users.schema";
import { FileInterceptor } from "@nestjs/platform-express";
import { LoggedUser } from "modules/utils/decorators/user.decorator";
import { IAccessToken } from "modules/auth/interfaces/jwt.interface";
import { JwtAuthGuard } from "modules/auth/jwt-auth.guard";
import { ForgetPasswordPayloadDto } from "modules/token/dto/forgetPassword.dto";
import { UserChangePasswordDTO } from "./dto/recovery-password.dto";


@Controller('users')
@UsePipes(new ValidationPipe({ transform: true }))
export class UsersController {
    constructor(
        private readonly service: UsersService
    ) { }

    @Post()
    create(
        @Body() dto: CreateUser,
    ) {
        return this.service.create(dto)
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    @Patch()
    patch(
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: EditUser,
        @LoggedUser() user: IAccessToken,
    ) {
        return this.service.patch(dto, file, user.id)
    }

    findOne(
        @Query() dto: GetUser
    ): Promise<Users[]> {
        return this.service.findAll(dto)
    }

    @Get('verify-email-username')
    verifyEmailUsername(
        @Query() dto: {
            email: string,
            username: string
        }
    ): Promise<{
        exist: boolean;
    }> {
        return this.service.verifyEmailUsername(dto)
    }

    @Post('forget-password')
    async sendRecoveryUrlToEmail(
        @Body(new ValidationPipe()) user: ForgetPasswordPayloadDto): Promise<{}> {
        return await this.service.sendEmail(user)
    }

    @Post()
    async recoveryPassword(
        @Headers('authorization') token: string,
        @Body(new ValidationPipe()) user: UserChangePasswordDTO): Promise<{ message: string }> {
        return await this.service.recoveryPassword(user, token)
    }

}