import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type UserBillDocument = HydratedDocument<UserBill>;
@Schema()
export class UserBill {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  bill: number;

  @Prop({ required: true })
  type: string;

  @Prop()
  time: Date;
}

export const UserBillSchema = SchemaFactory.createForClass(UserBill);
