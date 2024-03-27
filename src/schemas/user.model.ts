import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Card } from './card.model';

@Schema()
export class User extends Document {
  @Prop({ unique: true , required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  avatarDataUri: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }] })
  createdCards: Card[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }] })
  assignedCards: Card[];
}

export const UserSchema = SchemaFactory.createForClass(User);