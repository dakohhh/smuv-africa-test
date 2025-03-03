import "reflect-metadata";
import express from "express";
import { Container } from "typedi";
import { AuthController } from "@/controller/auth.controller";

export default (router: express.Router) => {
  const authController = Container.get(AuthController);
  router.post("/auth/login", (req, res, next) => authController.login(req, res, next));
  router.post("/auth/signup", (req, res, next) => authController.signupUser(req, res, next));
};
