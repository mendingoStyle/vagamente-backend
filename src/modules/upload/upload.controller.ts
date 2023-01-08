
import { Body, Controller, Get, ParseFilePipe, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";


@Controller('upload')
export class UploadController {
    constructor() { }
    @UseInterceptors(FileInterceptor('file'))
    @Post()
    uploadFileAndPassValidation(
        @Body() body: any,
        @UploadedFile()
        file: Express.Multer.File,
    ) {
        console.log(file)
        return {
            file: file?.buffer.toString(),
        };
    }

}