import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type OrganisationDocument = HydratedDocument<Organisation>;

@Schema()
export class Organisation {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  admin: mongoose.Types.ObjectId;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  })
  managers: mongoose.Types.ObjectId[];

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  })
  members: mongoose.Types.ObjectId[];
}

export const OrganisationSchema = SchemaFactory.createForClass(Organisation);

OrganisationSchema.set('timestamps', true);
