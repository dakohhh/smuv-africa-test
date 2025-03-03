import { Types, Document } from "mongoose";
import { IProduct } from "./product";

export interface IOrder extends Document {
  user: Types.ObjectId | string;
  product: Types.ObjectId | IProduct | string;
  quantity: number;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
