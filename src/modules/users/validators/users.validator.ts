import { Injectable } from "@nestjs/common";
import { CreateUser, EditUser } from "../dto/users.create.dto";
import { GetUser } from "../dto/users.get.dto";
import { UsersRepository } from "../users.repository";
import { UtilsService } from "modules/utils/utils.service";
import { ForgetPasswordPayloadDto } from "modules/token/dto/forgetPassword.dto";
import { Users } from "database/schemas/users.schema";
import { UserChangePasswordDTO } from "../dto/recovery-password.dto";



@Injectable()
export class UsersValidator {
    constructor(
        private readonly repository: UsersRepository,
        private readonly utils: UtilsService
    ) { }
    async validateToSave(dto: CreateUser) {
        const verify = await this.repository.findOneByEmailOrUsername({ email: dto.email, username: dto.username }, null)
        if (verify) {
            if (verify.email === dto.email) {
                throw this.utils.throwErrorBadReqException('email já cadastrado')
            } else {
                throw this.utils.throwErrorBadReqException('username já cadastrado')
            }
        }


    }
    isValid(file: Express.Multer.File): boolean | Promise<boolean> {
        const in_mb = file.size / 1000000
        return in_mb <= 10000000
    }
    
    fileValidation(file: Express.Multer.File) {
        const allowedExtensions = '^.*\.(jpg|JPG|gif|png|mp4|jpeg|JPEG|webp)$'
        const regex = new RegExp(allowedExtensions);
        return regex.test(file.originalname)
    }

    validateToEdit(dto: EditUser, file: Express.Multer.File, file_cape: Express.Multer.File) {
        if (file) {
            if (!this.isValid(file)) {
                throw this.utils.throwErrorBadReqException("imagem muito grande")
            }
            if (!this.fileValidation(file))
                throw this.utils.throwErrorBadReqException("imagem com tipo inválido")

        }
        if (file_cape) {
            if (!this.isValid(file_cape)) {
                throw this.utils.throwErrorBadReqException("imagem muito grande")
            }
            if (!this.fileValidation(file_cape))
                throw this.utils.throwErrorBadReqException("imagem com tipo inválido")
        }
    }
    async findAllValidate(dto: GetUser) {
    }
    async findAllValidateVerifyUsernameEmail(dto: GetUser) {
        if (!dto.username && !dto.email) {
            throw this.utils.throwErrorBadReqException('preencha o email ou username')
        }
    }

    sendEmailValidator(dto) {
        if (!dto.email) {
            throw this.utils.throwNotFoundException('Preencha o email')
        }
    }
    recoveryPassword(user: UserChangePasswordDTO, token: string) {
        if (user.password !== user.confirmPassword) {
            throw this.utils.throwForbiddenException(
                'Campo password e Campo confirmPassword Diferentes'
            )
        }
        if (!token) {
            throw this.utils.throwForbiddenException(
                'Não autorizado'
            )
        }

    }

}