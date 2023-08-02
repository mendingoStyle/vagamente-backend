
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Users } from './users.schema';

export type UserKeysDocument = HydratedDocument<UserKeys>;

@Schema()
export class UserKeys {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Users.name
    })
    user_id: mongoose.Schema.Types.ObjectId;

    @Prop()
    public_key: string

    @Prop()
    private_key: string

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;

    @Prop()
    deleted_at: Date;

}

export const UserKeysSchema = SchemaFactory.createForClass(UserKeys);