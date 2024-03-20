import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './user.model';

@Schema()
export class Card extends Document {
  @Prop({ required: true})
  title: string;

  @Prop()
  description: string;

  @Prop()
  section: string;

  @Prop()
  label: string;

  @Prop()
  isOnCalendar: boolean;

  @Prop({ type: String, default: null })
  day?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  createdBy: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  assignedUsers?: User[];
}

export const CardSchema = SchemaFactory.createForClass(Card);