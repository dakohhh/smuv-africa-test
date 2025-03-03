import { Service } from "typedi";
import { StatusCodes } from "http-status-codes";
import { HttpResponse } from "@/utils/response";
import { AuthService } from "@/services/auth.service";
import { Request, Response, NextFunction } from "express";

@Service()
export class AuthController {
  constructor(private authService: AuthService) {}

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await this.authService.login(req);
      res.status(StatusCodes.OK).json(new HttpResponse("login successful", results));
    } catch (error) {
      next(error);
    }
  }

  async signupUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.authService.registerUser(req);
      const results = { user: user };

      res.status(StatusCodes.CREATED).json(new HttpResponse("user registered successful", results));
    } catch (error) {
      next(error);
    }
  }
}
