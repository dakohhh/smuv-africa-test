import { IProduct } from "./product";
import { Document, Types } from "mongoose";
export interface IFlashSale extends Document {
  product: Types.ObjectId | IProduct | string;
  stock: number;
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
  quantityPerTransaction?: number | null;
  createdAt: Date;
  updatedAt: Date;
}
