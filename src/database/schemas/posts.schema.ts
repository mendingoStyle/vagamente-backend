
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Users } from './users.schema';
import * as mongoose from 'mongoose';

export type PostsDocument = HydratedDocument<Posts>;

export class Reactions {

}

@Schema()
export class Posts {
    @Prop()
    title: string;

    @Prop()
    user_id: string;

    @Prop()
    created_at: Date;

    @Prop()
    content_resource: string

    @Prop()
    updated_at: Date;

    @Prop()
    tags: string[];


}

export const PostsSchema = SchemaFactory.createForClass(Posts);