
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose'

export type BadgesDocument = HydratedDocument<Badges>;

@Schema()
export class Badges {
    @Prop()
    name: string;

    @Prop()
    icon_resource: string

    @Prop()
    level: string

    @Prop()
    category: string

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;
}

export const BadgesSchema = SchemaFactory.createForClass(Badges);