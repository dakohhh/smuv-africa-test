import { IUser } from "./user";
import { Types, Document } from "mongoose";
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
  createdBy: Types.ObjectId | IUser | string;
  createdAt: Date;
  updatedAt: Date;
}
