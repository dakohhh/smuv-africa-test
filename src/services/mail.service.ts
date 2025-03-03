import EmailVerification from "@/email-templates/email-verification";
import PasswordReset from "@/email-templates/password-reset";
import { IVerificationToken } from "@/types";
import { IUser } from "@/types";
import { render } from "@react-email/components";
import settings from "@/settings";
import nodemailer from "nodemailer";
import { Service } from "typedi";
import { mailerInstance } from "@/libraries/nodemailer";

@Service()
export class MailService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async sendWelcomeMail(user: Pick<IUser, "_id" | "email">) {}

  async sendVerificationEmail(user: Pick<IUser, "email" | "firstname" | "lastname">, token: Pick<IVerificationToken, "token">) {
    const emailProp = {
      name: `${user.firstname} ${user.lastname}`,
      verificationLink: `${settings.BASE_URL}/auth/verify?token=${token.token}?email=${user.email}`,
    };

    const mailOptions: nodemailer.SendMailOptions = {
      to: user.email,
      subject: "Verification for User",
      text: render(EmailVerification(emailProp), { plainText: true }),
      html: render(EmailVerification(emailProp)),
    };

    return await mailerInstance.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(user: Pick<IUser, "email" | "firstname" | "lastname">, token: Pick<IVerificationToken, "token">) {
    const emailProp = {
      name: `${user.firstname} ${user.lastname}`,
      passwordResetLink: `${settings.BASE_URL}/auth/reset-password?token=${token.token}?email=${user.email}`,
    };

    const mailOptions: nodemailer.SendMailOptions = {
      to: user.email,
      subject: "Reset Password for User",
      text: render(PasswordReset(emailProp), { plainText: true }),
      html: render(PasswordReset(emailProp)),
    };

    return await mailerInstance.sendMail(mailOptions);
  }
}
