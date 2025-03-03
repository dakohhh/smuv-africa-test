import { Service } from "typedi";
import { StatusCodes } from "http-status-codes";
import { HttpResponse } from "@/utils/response";
import { Response, NextFunction } from "express";
import { AuthRequest } from "@/types/auth";
import { LeaderboardService } from "@/services/leaderboard.service";
@Service()
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  async getLeaderboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const results = await this.leaderboardService.getLeaderboard(req);
      res.status(StatusCodes.OK).json(new HttpResponse("leaderboard fetched successfully", results));
    } catch (error) {
      next(error);
    }
  }
}
