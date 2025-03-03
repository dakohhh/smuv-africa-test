import ms from "ms";
import { HttpResponse } from "@/utils/response";
import rateLimit from "express-rate-limit";

interface RateLimitOptions {
  duration: string;
  limit: number;
}

/**
 * RateLimiter
 * @param options - The options for the rate limiter
 * @returns The rate limiter middleware
 */
function rateLimiter(options: RateLimitOptions) {
  const flashSaleLimiter = rateLimit({
    windowMs: ms(options.duration),
    max: options.limit,
    message: new HttpResponse("Too many requests, please try again later.", null, false),
    headers: true,
  });

  return flashSaleLimiter;
}

export default rateLimiter;
