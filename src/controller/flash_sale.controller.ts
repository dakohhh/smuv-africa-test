import { Service } from "typedi";
import { StatusCodes } from "http-status-codes";
import { HttpResponse } from "@/utils/response";
import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "@/types/auth";
import { FlashSaleService } from "@/services/flash_sale.service";
@Service()
export class FlashSaleController {
  constructor(private flashSaleService: FlashSaleService) {}

  async startFlashSale(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const results = await this.flashSaleService.startFlashSale(req);
      res.status(StatusCodes.OK).json(new HttpResponse("flash sale started successfully", results));
    } catch (error) {
      next(error);
    }
  }

  async endFlashSale(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await this.flashSaleService.endFlashSale(req);

      res.status(StatusCodes.OK).json(new HttpResponse("flash sale ended successfully", results));
    } catch (error) {
      next(error);
    }
  }

  async restartFlashSale(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await this.flashSaleService.restartFlashSale(req);

      res.status(StatusCodes.OK).json(new HttpResponse("flash sale restarted successfully", results));
    } catch (error) {
      next(error);
    }
  }

  async getCurrentFlashSaleProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await this.flashSaleService.getCurrentFlashSaleProducts(req);
      res.status(StatusCodes.OK).json(new HttpResponse("current flash sale products fetched successfully", results));
    } catch (error) {
      next(error);
    }
  }

  async getUpcomingFlashSaleProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await this.flashSaleService.getUpcomingFlashSaleProducts(req);
      res.status(StatusCodes.OK).json(new HttpResponse("upcoming flash sale products fetched successfully", results));
    } catch (error) {
      next(error);
    }
  }
}
