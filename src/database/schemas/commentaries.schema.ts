
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Users } from './users.schema';
import * as mongoose from 'mongoose';
import { Posts } from './posts.schema';

export type CommentariesDocument = HydratedDocument<Commentaries>;

export class Reactions {

}

@Schema()
export class Commentaries {
    @Prop()
    commentary: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Users.name
    })
    user_id: mongoose.Schema.Types.ObjectId;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Posts.name
    })
    post_id: mongoose.Schema.Types.ObjectId

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;

    @Prop()
    deleted_at: Date;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Commentaries.name
    })
    answer_id: mongoose.Schema.Types.ObjectId
}

export const CommentariesSchema = SchemaFactory.createForClass(Commentaries);