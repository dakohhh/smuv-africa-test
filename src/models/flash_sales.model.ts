import { IFlashSale } from "@/types";
import mongoose, { Schema } from "mongoose";

const FlashSaleSchema: Schema<IFlashSale> = new mongoose.Schema<IFlashSale>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 200,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: false,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },

    quantityPerTransaction: {
      type: Number,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

FlashSaleSchema.methods.isCurrentlyActive = function (): boolean {
  const now = new Date();
  return this.isActive && now >= this.startTime && (this.endTime === undefined || now <= this.endTime) && this.remainingStock > 0;
};

const FlashSale = mongoose.model<IFlashSale>("FlashSale", FlashSaleSchema);

export default FlashSale;
