import { AuthRequest } from "@/types/auth";
import { Service } from "typedi";
@Service()
export class UserService {
  async getUserSession({ user }: Partial<AuthRequest>) {
    const context = {
      session: {
        role: user?.role,
        email: user?.email,
        isVerified: user?.isVerified,
        lastActive: user?.lastActive,
      },
    };

    return context;
  }
}
