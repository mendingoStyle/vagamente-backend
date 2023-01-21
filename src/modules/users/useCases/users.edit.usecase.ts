import { Injectable } from "@nestjs/common";
import { CreateUser, EditUser } from "../dto/users.create.dto";
import { UsersValidator } from "../validators/users.validator";
import { UsersRepository } from "../users.repository";
import { UtilsService } from "modules/utils/utils.service";
import { UploadService } from "modules/upload/upload.service";
import * as bcrypt from 'bcrypt'


@Injectable()
export class EditUserUseCase {
    constructor(
        private readonly validator: UsersValidator,
        private readonly repository: UsersRepository,
        private readonly utils: UtilsService,
        private readonly uploadService: UploadService,
    ) { }
    async patch(body: EditUser, file: Express.Multer.File, userId: string) {
        try {
            await this.validator.validateToSave(body)
            if (!body.avatar && file)
                body.avatar = (await this.uploadService.create(file))?.url
            body._id = userId
            if (body.password) body.password = await bcrypt.hash(body.password, 12)
            return this.repository.patch(body)
        } catch (e) {
            if (e.message)
                throw this.utils.throwErrorBadReqException(e.message)
            else
                throw this.utils.throwErrorBadReqException(e)
        }
    }
}