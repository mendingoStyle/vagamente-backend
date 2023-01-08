import { Injectable } from "@nestjs/common";
const cloudinary = require("cloudinary").v2;
const streamifier = require('streamifier');

@Injectable()
export class UploadService {
    constructor(

    ) { }
    async create(file): Promise<any> {
        cloudinary.config({
            cloud_name: 'dvzunnikc',
            api_key: '694778842161446',
            api_secret: 'cFZEfErzqhnevyGvyfJr2wSzsgE',
            secure: true
        });

        let cld_upload_stream = cloudinary.uploader.upload_stream(
            {
                folder: "foo"
            },
            (error: any, result: any) => {
                if(error) console.log(error)
                if(result) console.log(result)

            }
        );

        let result = await streamifier.createReadStream(file.buffer).pipe(cld_upload_stream);

        console.log(result)
        return result
    }

}