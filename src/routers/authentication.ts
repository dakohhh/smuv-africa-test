import "reflect-metadata";
import express from "express";
import { Container } from "typedi";
import rateLimiter from "@/middleware/ratelimit.middleware";
import { AuthController } from "@/controller/auth.controller";

export default (router: express.Router) => {
  const authController = Container.get(AuthController);
  router.post("/auth/login", rateLimiter({ duration: "1m", limit: 10 }), (req, res, next) => authController.login(req, res, next));
  router.post("/auth/signup", rateLimiter({ duration: "1m", limit: 10 }), (req, res, next) => authController.signupUser(req, res, next));
};
