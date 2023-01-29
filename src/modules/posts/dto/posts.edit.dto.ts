import { Transform, Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import mongoose from "mongoose";

export class EditPost {
    
    @IsString()
    @IsOptional()
    "_id"?: string

    @IsString()
    @IsOptional()
    user_id?: string;

    @Type(() => Date)
    deleted_at: Date

}
