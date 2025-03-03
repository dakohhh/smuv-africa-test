import Joi from "joi";
import { Service } from "typedi";
import { AuthRequest } from "@/types/auth";
import Order from "@/models/order.model";
import { BadRequestException } from "@/utils/exceptions";
import { Paginator } from "@/utils/pagination";
@Service()
export class LeaderboardService {
  async getLeaderboard({ query }: Partial<AuthRequest>) {
    const { error, value: data } = Joi.object({
      productId: Joi.string().trim().required(),
      page: Joi.number().optional().default(1),
      limit: Joi.number().optional().default(10),
    })
      .options({ stripUnknown: true })
      .validate(query);

    if (error) throw new BadRequestException(error.message.replace(/"/g, ""));

    const paginator = new Paginator(Order, data.page, data.limit, {
      filter: { product: data.productId },
      projection: { _id: 1, user: 1 },
      sort: { createdAt: -1 },
    });
    const { data: leaderboard, meta: pagination } = await paginator.paginate();

    return { leaderboard, pagination };
  }
}
