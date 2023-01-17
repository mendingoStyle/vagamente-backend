
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose'

export type TagsDocument = HydratedDocument<Tags>;

@Schema()
export class Tags {
    @Prop()
    title: string;

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;
}

export const TagsSchema = SchemaFactory.createForClass(Tags);