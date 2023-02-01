import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
const cloudinary = require("cloudinary").v2;
const streamifier = require('streamifier');

@Injectable()
export class UploadService {
    constructor(private readonly configService: ConfigService) { }
    async create(file): Promise<any> {
        cloudinary.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
            secure: true
        });
  
        let fileObjOptions: any = {
            folder: this.configService.get('CLOUDINARY_POST_FOLDER')
        }
        if (file.mimetype.includes('video')) {
            fileObjOptions = {
                ...fileObjOptions,
                resource_type: "video",
                chunk_size: 6000000,
                eager: [
                    { width: 300, height: 300, crop: "pad", audio_codec: "none" },
                    { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" }],
                eager_async: true,
            }
        }
        const uploadFromBuffer = async () => {
            return new Promise(async function (resolve, reject) {
                const cld_upload_stream = await cloudinary.uploader.upload_stream(

                    {
                        ...fileObjOptions
                    },
                    (error: any, result: any) => {
                        if (error) reject(null)
                        if (result) {
                            resolve(result)
                        }
                    }
                );
                await streamifier.createReadStream(file.buffer).pipe(cld_upload_stream);
            })
        }
        return uploadFromBuffer()
    }


}