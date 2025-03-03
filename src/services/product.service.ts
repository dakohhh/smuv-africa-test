import Joi from "joi";
import { Service } from "typedi";
import { AuthRequest } from "@/types/auth";
import Product from "@/models/product.model";
import { BadRequestException } from "@/utils/exceptions";
import { Paginator } from "@/utils/pagination";
@Service()
export class ProductService {
  async createProduct({ body, user }: Partial<AuthRequest>) {
    const { error, value: data } = Joi.object({
      name: Joi.string().trim().min(3).max(100).required(),
      description: Joi.string().trim().min(3).max(500).required(),
      price: Joi.number().required(),
    })
      .options({ stripUnknown: true })
      .validate(body);

    if (error) throw new BadRequestException(error.message.replace(/"/g, ""));

    const product = await Product.create({ ...data, createdBy: user?._id });
    return product;
  }

  async getProducts({ query }: Partial<AuthRequest>) {
    const { error, value: data } = Joi.object({
      page: Joi.number().optional().default(1),
      limit: Joi.number().optional().default(10),
    })
      .options({ stripUnknown: true })
      .validate(query);

    if (error) throw new BadRequestException(error.message.replace(/"/g, ""));

    const paginator = new Paginator(Product, data.page, data.limit);
    const { data: products, meta: pagination } = await paginator.paginate();
    return { products, pagination };
  }
}
