
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose'
import { Users } from './users.schema';

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema()
export class RefreshToken {
    @Prop()
    token: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Users.name
    })
    user_id: mongoose.Schema.Types.ObjectId;

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);