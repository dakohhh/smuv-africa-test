import Joi from "joi";
import { Service } from "typedi";
import { isMongoId } from "validator";
import { IProduct } from "@/types/product";
import { AuthRequest } from "@/types/auth";
import Order from "@/models/order.model";
import { BadRequestException } from "@/utils/exceptions";
import FlashSale from "@/models/flash_sales.model";
@Service()
export class PurchaseService {
  async purchaseProduct({ body, user }: Partial<AuthRequest>) {
    const { error, value: data } = Joi.object({
      flashSaleId: Joi.string().trim().required(),
      quantity: Joi.number().required(),
    })
      .options({ stripUnknown: true })
      .validate(body);

    if (error) throw new BadRequestException(error.message.replace(/"/g, ""));

    // Validate productId
    if (!isMongoId(data.flashSaleId)) throw new BadRequestException("Invalid flash sale Id");

    // Check if product exists
    const flashSale = await FlashSale.findById(data.flashSaleId)
      .populate({ path: "product", select: ["name", "price"] })
      .lean();

    if (!flashSale) throw new BadRequestException("Flash sale not found");

    // Check if flash sale is active
    if (!flashSale.isActive) throw new BadRequestException("Flash sale has ended");

    // Check if flash sale has started
    if (flashSale.startTime > new Date()) throw new BadRequestException("Flash sale has not started yet");

    // Check if flash sale has ended
    if (flashSale.endTime && flashSale.endTime < new Date()) throw new BadRequestException("Flash sale has ended");

    // Check if the stock is available
    if (flashSale.stock < data.quantity) throw new BadRequestException("Not enough in stock");

    // Check if the quantity per transaction is available
    if (flashSale.quantityPerTransaction && data.quantity > flashSale.quantityPerTransaction) throw new BadRequestException("Quantity per transaction exceeded");

    // Update the stock of the flash sale product
    await FlashSale.findByIdAndUpdate(flashSale._id, { stock: flashSale.stock - data.quantity });

    // Create the order
    const order = await Order.create({
      user: user?._id,
      product: flashSale.product,
      quantity: data.quantity,
      totalAmount: (flashSale.product as IProduct).price * data.quantity,
    });
    return order;
  }
}
