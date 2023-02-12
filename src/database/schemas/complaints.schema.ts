
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Users } from './users.schema';
import * as mongoose from 'mongoose';
import { Posts } from './posts.schema';
import { Commentaries } from './commentaries.schema';

export type ComplaintsDocument = HydratedDocument<Complaints>;

export class Reactions {

}

@Schema()
export class Complaints {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Posts.name
    })
    post_id: mongoose.Schema.Types.ObjectId

    @Prop({
        type: mongoose.Schema.Types.ObjectId
    })
    user_id: mongoose.Schema.Types.ObjectId;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Commentaries.name
    })
    commentary_id: mongoose.Schema.Types.ObjectId

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;

    @Prop()
    deleted_at: Date;

    @Prop()
    reviewed: boolean

    @Prop()
    reason: string

}

export const ComplaintsSchema = SchemaFactory.createForClass(Complaints);