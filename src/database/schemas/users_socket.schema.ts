
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type UsersSocketDocument = HydratedDocument<UsersSocket>;

@Schema()
export class UsersSocket {
    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;

    @Prop()
    deleted_at: Date;

    @Prop({
        type: mongoose.Schema.Types.ObjectId
    })
    user_id: mongoose.Schema.Types.ObjectId;

    @Prop()
    socket_id: string;
}

export const UsersSocketSchema = SchemaFactory.createForClass(UsersSocket);