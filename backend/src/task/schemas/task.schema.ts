import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

export enum TaskStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

@Schema()
export class Task {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organisation',
  })
  org_id: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  created_by: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  })
  assigned_to: mongoose.Types.ObjectId[];

  @Prop({
    required: true,
    type: String,
  })
  title: string;

  @Prop({
    type: String,
  })
  description: string;

  @Prop({
    required: true,
    type: Date,
  })
  due_date: Date;

  @Prop({
    default: false,
  })
  priority: boolean;

  @Prop({
    enum: TaskStatus,
    default: TaskStatus.NOT_STARTED,
  })
  status: TaskStatus;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.set('timestamps', true);
