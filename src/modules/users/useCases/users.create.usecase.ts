import { Injectable } from "@nestjs/common";
import { CreateUser } from "../dto/users.create.dto";
import { UsersValidator } from "../validators/users.validator";
import { UsersRepository } from "../users.repository";
import { UtilsService } from "modules/utils/utils.service";
import { UploadService } from "modules/upload/upload.service";


@Injectable()
export class CreateUserUseCase {
    constructor(
        private readonly validator: UsersValidator,
        private readonly repository: UsersRepository,
        private readonly utils: UtilsService,
        private readonly uploadService: UploadService,
    ) { }
    async create(body: CreateUser, file: Express.Multer.File) {
        try {
            body = await this.validator.validateToSave(body)
            if (!body.avatar)
                body.avatar = await this.uploadService.create(file)
            return this.repository.create(body)
        } catch (e) {
            if (e.message)
                throw this.utils.throwErrorBadReqException(e.message)
            else
                throw this.utils.throwErrorBadReqException(e)
        }
    }
}