import { IsNotEmpty } from "@nestjs/class-validator";
import { ReactionsEnum } from "database/schemas/reactions.schema";
import mongoose from "mongoose";

export class CreateReaction {
    _id: string
    
    @IsNotEmpty()
    commentary_id: mongoose.Schema.Types.ObjectId

    @IsNotEmpty()
    type: ReactionsEnum

    user_id: mongoose.Schema.Types.ObjectId;

    created_at: Date;

    updated_at: Date;

    deleted_at: Date;
}
