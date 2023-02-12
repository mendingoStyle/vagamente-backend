import { Body, Controller, Get, Patch, Post, Query, UploadedFile, Headers, UseGuards, UseInterceptors, UsePipes, ValidationPipe, ParseFilePipeBuilder, HttpStatus } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUser, EditUser } from "./dto/users.create.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { LoggedUser } from "modules/utils/decorators/user.decorator";
import { IAccessToken } from "modules/auth/interfaces/jwt.interface";
import { ForgetPasswordPayloadDto } from "modules/token/dto/forgetPassword.dto";
import { UserChangePasswordDTO } from "./dto/recovery-password.dto";
import { JwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";


@Controller('users')
export class UsersController {
    constructor(
        private readonly service: UsersService
    ) { }

    @UsePipes(new ValidationPipe({ transform: true }))
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
        @UploadedFile(new ParseFilePipeBuilder()
            .addFileTypeValidator({
                fileType: '^.*\.(jpg|JPG|gif|png|mp4|jpeg|JPEG|webp)$',
            })
            .addMaxSizeValidator({
                maxSize: 10000000
            })
            .build({
                errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                fileIsRequired: false
            })) file: Express.Multer.File,
        @Body() dto: EditUser,
        @LoggedUser() user: IAccessToken,
    ) {
        return this.service.patch(dto, file, user.id)
    }

    @UsePipes(new ValidationPipe({ transform: true }))
    @Get('me')
    @UseGuards(JwtAuthGuard)
    findOne(
        @LoggedUser() user: IAccessToken,
    ): Promise<any> {
        return this.service.findAll({ _id: user.id })
    }

    @UsePipes(new ValidationPipe({ transform: true }))
    @Get('verify-email-username')
    verifyEmailUsername(
        @Query() dto: {
            email: string,
            username: string
        },
        @Headers('authorization') token: string,
    ): Promise<{
        exist: boolean;
    }> {
        return this.service.verifyEmailUsername(dto, token)
    }

    @UsePipes(new ValidationPipe({ transform: true }))
    @Post('forget-password')
    async sendRecoveryUrlToEmail(
        @Body(new ValidationPipe()) user: ForgetPasswordPayloadDto): Promise<{}> {
        return await this.service.sendEmail(user)
    }

    @UsePipes(new ValidationPipe({ transform: true }))
    @Post('recovery-password')
    async recoveryPassword(
        @Headers('authorization') token: string,
        @Body(new ValidationPipe()) user: UserChangePasswordDTO): Promise<{ message: string }> {
        return await this.service.recoveryPassword(user, token)
    }

    @Get('top-ten')
    topUsers() {
        return this.service.topUsers()
    }

}