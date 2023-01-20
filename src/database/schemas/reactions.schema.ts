
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';
import { Posts } from './posts.schema';

export type ReactionsDocument = HydratedDocument<Reactions>;
export enum ReactionsEnum {
    like = 'like',
    dislike = 'dislike'
}

@Schema()
export class Reactions {


    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Posts.name
    })
    post_id: mongoose.Schema.Types.ObjectId

    @Prop()
    type: ReactionsEnum

    @Prop({
        type: mongoose.Schema.Types.ObjectId
    })
    user_id: mongoose.Schema.Types.ObjectId;

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;

    @Prop()
    deleted_at: Date;
}

export const ReactionsSchema = SchemaFactory.createForClass(Reactions);