import { Service } from "typedi";
import { StatusCodes } from "http-status-codes";
import { HttpResponse } from "@/utils/response";
import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "@/types/auth";
import { ProductService } from "@/services/product.service";
@Service()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  async createProduct(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const results = await this.productService.createProduct(req);
      res.status(StatusCodes.CREATED).json(new HttpResponse("product created successfully", results));
    } catch (error) {
      next(error);
    }
  }

  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await this.productService.getProducts(req);

      res.status(StatusCodes.OK).json(new HttpResponse("products fetched successfully", results));
    } catch (error) {
      next(error);
    }
  }
}
