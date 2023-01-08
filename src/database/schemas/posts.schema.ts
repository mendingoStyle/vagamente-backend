
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose'

export type PostsDocument = HydratedDocument<Posts>;

@Schema()
export class Posts {
    @Prop()
    title: string;

    @Prop()
    user_id: number;

    @Prop()
    created_at: Date;

    @Prop()
    content_resource: string

    @Prop()
    updated_at: Date;
}

export const PostsSchema = SchemaFactory.createForClass(Posts);