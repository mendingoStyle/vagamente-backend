import { Injectable } from "@nestjs/common";
import { CreateUser, EditUser } from "../dto/users.create.dto";
import { UsersValidator } from "../validators/users.validator";
import { UsersRepository } from "../users.repository";
import { UtilsService } from "modules/utils/utils.service";
import { UploadService } from "modules/upload/upload.service";
import * as bcrypt from 'bcrypt'
import { EmailSenderDto } from "modules/utils/dto/emailSender.dto";
import { TokenService } from "modules/token/tokenController.service";
import { ConfigService } from "@nestjs/config";
import { EmailSenderSevice } from "modules/utils/email-sender.service";
import { ForgetPasswordPayloadDto } from "modules/token/dto/forgetPassword.dto";
import { UserChangePasswordDTO } from "../dto/recovery-password.dto";
import { userInfo } from "os";


@Injectable()
export class EditUserUseCase {
    constructor(
        private readonly validator: UsersValidator,
        private readonly repository: UsersRepository,
        private readonly utils: UtilsService,
        private readonly uploadService: UploadService,
        private readonly auth: TokenService,
        private config: ConfigService,
        private readonly sendEmailService: EmailSenderSevice
    ) { }
    async patch(body: EditUser, file: Express.Multer.File, userId: string) {
        try {
            await this.validator.validateToEdit(body)
            if (!body.avatar && file)
                body.avatar = (await this.uploadService.create(file))?.url
            body._id = userId
            if (body.password) {
                const user = (await this.repository.findAll({ _id: body._id }))[0]
                if (!user || !body.oldPassword || !(await bcrypt.compare(body?.oldPassword, user?.password)))
                    throw this.utils.throwNotFoundException(
                        this.utils.errorMessages.invalidCredentials
                    )
                body.password = await bcrypt.hash(body.password, 12)
                delete body['oldPassword'];
            }
            return this.repository.patch(body)
        } catch (e) {
            if (e.message)
                throw this.utils.throwErrorBadReqException(e.message)
            else
                throw this.utils.throwErrorBadReqException(e)
        }
    }
    async sendEmail(user: ForgetPasswordPayloadDto) {
        this.validator.sendEmailValidator(user)
        let userExists = null
        if (user.email) {
            userExists = await this.repository.validateIfNotExists([{
                key: 'email', value: user.email, errorMessage: 'Usuário não encontrado'
            }])
        }
        const accessToken = await this.auth.createTokenChangePassword(userExists)
        const sendEmailPayload: EmailSenderDto = {
            url:
                this.config.get('FRONT_URL') +
                'recuperar-senha?token=' +
                accessToken.accessToken,
            subject: 'Recovery Password Vagamente SYSTEM',
            messageAccept: 'Email de recuperação enviado com sucesso',
            email: userExists.email
        }
        return await this.sendEmailService.sender(sendEmailPayload)
    }
    async changePassword(
        user: UserChangePasswordDTO,
        token: string
    ): Promise<{ message: string }> {
        if (user.password !== user.confirmPassword) {
            throw this.utils.throwForbiddenException(
                'Campo password e Campo confirmPassword Diferentes'
            )
        }

        const auth = await this.auth.verifyTokenChangePassword(
            token.split('Bearer ')[1]
        )
        if (!auth.changePassword) {
            throw this.utils.throwForbiddenException('Não autorizado')
        }
        if (auth.id > 0) {
            const userEdit = {
                _id: auth.id,
                password: await bcrypt.hash(user.password, 12)
            }
            const update = await this.repository.patch(userEdit)
            if (update.message === 'ok') return { message: "Senha atualizada com sucesso" }
        }
        throw this.utils.throwErrorBadReqException("Não foi possível atualizar a senha")

    }
    async recoveryPassword(user: UserChangePasswordDTO, token: string) {
        this.validator.recoveryPassword(user, token)

        const auth = await this.auth.verifyTokenChangePassword(
            token.split('Bearer ')[1]
        )
        if (!auth.changePassword) {
            throw this.utils.throwForbiddenException('Não autorizado')
        }
        if (auth.id > 0) {

            const update = await this.repository.patch({ _id: auth.id, password: await bcrypt.hash(user.password, 12) })
            if (update.message === 'ok') return { message: "Senha atualizada com sucesso" }
        }
        throw this.utils.throwErrorBadReqException("Não foi possível atualizar a senha")

    }
}