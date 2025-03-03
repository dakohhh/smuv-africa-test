import "reflect-metadata";
import express from "express";
import { UserController } from "@/controller/user.controller";
import auth from "@/middleware/auth.middleware";
import { UserRoles } from "@/enums/user-roles";
import { Container } from "typedi";

export default (router: express.Router) => {
  const userController = Container.get(UserController);
  router.get("/user/", auth([UserRoles.DEFAULT]), (req, res, next) => userController.getUserSession(req, res, next));
};
