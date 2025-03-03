import Joi from "joi";
import { Service } from "typedi";
import { AuthRequest } from "@/types/auth";
import { isMongoId } from "validator";
import { BadRequestException } from "@/utils/exceptions";
import Product from "@/models/product.model";
import FlashSale from "@/models/flash_sales.model";
import { Paginator } from "@/utils/pagination";

@Service()
export class FlashSaleService {
  async startFlashSale({ body }: Partial<AuthRequest>) {
    const { error, value: data } = Joi.object({
      productId: Joi.string().trim().required(),
      startTime: Joi.date().min("now").required().messages({
        "date.min": "Start time must be a future date",
      }),
      endTime: Joi.date().min(Joi.ref("startTime")).optional().messages({
        "date.min": "End time must be after start time",
      }),
      quantityPerTransaction: Joi.number().optional().default(null),
    })
      .options({ stripUnknown: true })
      .validate(body);

    if (error) throw new BadRequestException(error.message.replace(/"/g, ""));

    // Check if productId is a valid MongoDB ObjectId
    if (!isMongoId(data.productId)) throw new BadRequestException("Invalid product Id");

    // Check if product exists
    const product = await Product.findById(data.productId);
    if (!product) throw new BadRequestException("Product not found");

    // Check if flash sale already exists
    const flashSale = await FlashSale.findOne({ product: data.productId });
    if (flashSale) throw new BadRequestException("Flash sale already exists");

    const newFlashSale = await FlashSale.create({ ...data, product: product._id });
    return newFlashSale;
  }

  async endFlashSale({ params }: Partial<AuthRequest>) {
    const { error, value: data } = Joi.object({
      flashSaleId: Joi.string().trim().required(),
    })
      .options({ stripUnknown: true })
      .validate(params);

    if (error) throw new BadRequestException(error.message.replace(/"/g, ""));

    // Check if flashSaleId is a valid MongoDB ObjectId
    if (!isMongoId(data.flashSaleId)) throw new BadRequestException("Invalid flash sale Id");

    // Check if flash sale exists
    const flashSale = await FlashSale.findById(data.flashSaleId);
    if (!flashSale) throw new BadRequestException("Flash sale not found");

    const updatedFlashSale = await FlashSale.findByIdAndUpdate(data.flashSaleId, { isActive: false }, { new: true });
    return updatedFlashSale;
  }

  async restartFlashSale({ body }: Partial<AuthRequest>) {
    const { error, value: data } = Joi.object({
      flashSaleId: Joi.string().trim().required(),
      startTime: Joi.date().min("now").required().messages({
        "date.min": "Start time must be a future date",
      }),
      endTime: Joi.date().min(Joi.ref("startTime")).optional().messages({
        "date.min": "End time must be after start time",
      }),
    })
      .options({ stripUnknown: true })
      .validate(body);

    if (error) throw new BadRequestException(error.message.replace(/"/g, ""));

    // Check if flashSaleId is a valid MongoDB ObjectId
    if (!isMongoId(data.flashSaleId)) throw new BadRequestException("Invalid flash sale Id");

    // Check if flash sale exists
    const flashSale = await FlashSale.findById(data.flashSaleId);
    if (!flashSale) throw new BadRequestException("Flash sale not found");

    const updatedFlashSale = await FlashSale.findByIdAndUpdate(data.flashSaleId, { isActive: true, startTime: data.startTime, endTime: data.endTime }, { new: true });
    return updatedFlashSale;
  }

  async getCurrentFlashSaleProducts({ query }: Partial<AuthRequest>) {
    const { error, value: data } = Joi.object({
      page: Joi.number().optional().default(1),
      limit: Joi.number().optional().default(10),
    })
      .options({ stripUnknown: true })
      .validate(query);

    if (error) throw new BadRequestException(error.message.replace(/"/g, ""));

    const paginator = new Paginator(FlashSale, data.page, data.limit, {
      filter: { isActive: true, startTime: { $lte: new Date() }, endTime: { $gte: new Date() } },
      populate: { path: "product", select: ["name", "price", "stock"] },
      projection: { _id: 1, product: 1, startTime: 1, endTime: 1, stock: 1 },
      sort: { createdAt: -1 },
    });
    const { data: currentFlashSales, meta: pagination } = await paginator.paginate();
    return { currentFlashSales, pagination };
  }

  async getUpcomingFlashSaleProducts({ query }: Partial<AuthRequest>) {
    const { error, value: data } = Joi.object({
      page: Joi.number().optional().default(1),
      limit: Joi.number().optional().default(10),
    })
      .options({ stripUnknown: true })
      .validate(query);

    if (error) throw new BadRequestException(error.message.replace(/"/g, ""));

    const paginator = new Paginator(FlashSale, data.page, data.limit, {
      filter: { startTime: { $gte: new Date() } },
      populate: { path: "product", select: ["name", "price"] },
      projection: { _id: 1, product: 1, startTime: 1, endTime: 1 },
      sort: { createdAt: -1 },
    });
    const { data: upcomingFlashSales, meta: pagination } = await paginator.paginate();
    return { upcomingFlashSales, pagination };
  }
}
