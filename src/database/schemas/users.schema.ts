
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsersDocument = HydratedDocument<Users>;

@Schema()
export class Users {
    _id: string
    @Prop()
    name: string;

    @Prop()
    birth_date: Date;

    @Prop()
    password: string;

    @Prop({
        required: true,
        unique: true,
        type: String,
    })
    email: string;

    @Prop()
    avatar: string;

    @Prop({
        required: true,
        unique: true,
        type: String,
    })
    username: string;

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;

    @Prop()
    deleted_at: Date;
}

export const UsersSchema = SchemaFactory.createForClass(Users);