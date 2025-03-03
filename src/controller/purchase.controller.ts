import { Service } from "typedi";
import { StatusCodes } from "http-status-codes";
import { HttpResponse } from "@/utils/response";
import { AuthRequest } from "@/types/auth";
import { NextFunction, Response } from "express";
import { PurchaseService } from "@/services/purchase.service";
@Service()
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  async purchaseProduct(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const results = await this.purchaseService.purchaseProduct(req);
      res.status(StatusCodes.CREATED).json(new HttpResponse("product purchased successfully", results));
    } catch (error) {
      next(error);
    }
  }
}
