
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose'
import { Users } from './users.schema';

export type TagsDocument = HydratedDocument<Badges>;

@Schema()
export class Badges {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Users.name
    })
    user_id: mongoose.Schema.Types.ObjectId;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Badges.name
    })
    badge_id: mongoose.Schema.Types.ObjectId

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;

    @Prop()
    deleted_at: Date;
}

export const TagsSchema = SchemaFactory.createForClass(Badges);