import { Body, Controller, Get, Patch, Post, Query, UploadedFile, Headers, UseGuards, UseInterceptors, UsePipes, ValidationPipe, ParseFilePipeBuilder, HttpStatus, UploadedFiles, ParseFilePipe } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUser, EditUser } from "./dto/users.create.dto";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { LoggedUser } from "modules/utils/decorators/user.decorator";
import { IAccessToken } from "modules/auth/interfaces/jwt.interface";
import { ForgetPasswordPayloadDto } from "modules/token/dto/forgetPassword.dto";
import { UserChangePasswordDTO } from "./dto/recovery-password.dto";
import { JwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";
import { GetUserSearch } from "./dto/users.get.dto";


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
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'file', maxCount: 1 },
        { name: 'file_cape', maxCount: 1 },
    ]))
    @Patch()
    patch(
        @UploadedFiles() files: { file: Express.Multer.File[], file_cape: Express.Multer.File[] },
        @Body() dto: EditUser,
        @LoggedUser() user: IAccessToken,
    ) {
        return this.service.patch(dto,
            files?.file?.length > 0 ? files?.file[0] : undefined,
            user.id,
            files?.file_cape?.length > 0 ? files?.file_cape[0] : undefined
        )
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

    @UsePipes(new ValidationPipe({ transform: true }))
    @Get('find-users')
    find(
        @Query() dto: GetUserSearch
    ) {
        return this.service.find(dto)
    }

    @UsePipes(new ValidationPipe({ transform: true }))
    @Get('by-id')
    findById(
        @Query() dto: GetUserSearch,
        @Headers('authorization') token: string,
    ) {
        return this.service.findById(dto, token)
    }

}