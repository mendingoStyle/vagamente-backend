
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type NotificationsDocument = HydratedDocument<Notifications>;

export enum NotificationsEnum {
    notification = 'notification',
    message = 'message',
    friendRequest = 'friendRequest'

}

@Schema()
export class Notifications {
    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;

    @Prop()
    deleted_at: Date;

    @Prop()
    title: string

    @Prop()
    url: string

    @Prop()
    isRead: boolean

    @Prop({
        type: mongoose.Schema.Types.ObjectId
    })
    to_user_id: mongoose.Schema.Types.ObjectId;

    @Prop({
        type: mongoose.Schema.Types.ObjectId
    })
    from_user_id: mongoose.Schema.Types.ObjectId;
    
    @Prop()
    type: NotificationsEnum

}

export const NotificationsSchema = SchemaFactory.createForClass(Notifications);