import Joi from "joi";
import { User } from "@/models";
import { Request } from "express";
import { Service } from "typedi";
import { isPhoneNumber } from "class-validator";
import { BadRequestException } from "@/utils/exceptions";
import { hashPassword, comparePassword } from "@/authentication/hash";
import { MailService } from "./mail.service";
import { TokenService } from "./token.service";
import { VERIFICATION_TOKEN_TYPE } from "@/enums/token-types";

@Service()
export class AuthService {
  constructor(
    private readonly mailService: MailService,
    private readonly tokenService: TokenService
  ) {}
  async registerUser({ body }: Partial<Request>) {
    const { error, value } = Joi.object({
      firstname: Joi.string().trim().min(3).max(30).required(),
      lastname: Joi.string().trim().min(3).max(30).required(),
      phoneNumber: Joi.string().trim().required(),
      email: Joi.string().trim().email().required(),
      password: Joi.string().trim().required(),
    })
      .options({ stripUnknown: true })
      .validate(body);

    // Validate phone number
    if (!isPhoneNumber(value.phoneNumber, "NG")) throw new BadRequestException("Invalid phone number");

    if (error) throw new BadRequestException(error.message.replace(/"/g, ""));

    const hashedPassword = await hashPassword(value.password);

    const context = {
      firstname: value.firstname,
      lastname: value.lastname,
      phoneNumber: value.phoneNumber,
      email: value.email,
      password: hashedPassword,
    };

    const new_user = await new User(context).save();

    await new_user.save();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...student } = new_user.toObject();

    // Generate token for verification
    const token = await this.tokenService.generateVerificationAndResetToken({
      userId: new_user._id,
      token_type: VERIFICATION_TOKEN_TYPE.EMAIL_VERIFICATION,
    });

    await this.mailService.sendVerificationEmail(new_user, token);

    return student;
  }

  async login({ body }: Partial<Request>) {
    const { error, value } = Joi.object({
      email: Joi.string().email().min(3).max(30).required(),
      password: Joi.string().min(3).max(30).required(),
    })
      .options({ stripUnknown: true })
      .validate(body);

    if (error) throw new BadRequestException(error.message.replace(/"/g, ""));

    // Check if user exists
    const user = await User.findOne({ email: value.email });

    if (!user) throw new BadRequestException("incorrect email or password");

    // Check if password is correct
    const validPassword = await comparePassword(value.password, user.password);

    if (!validPassword) throw new BadRequestException("incorrect email or password");

    // Check if the user's account is disabled
    if (user.accountDisabled) throw new BadRequestException("Your account is disabled, please contact support");

    //Check if the user's account is verified
    // if (!user.isVerified) throw new BadRequestException("Account is not verified, please verify your account");

    // Generate JWT Token
    const token = await this.tokenService.generateAuthToken(user);

    return { role: user.role, token: token };
  }
}
