import "reflect-metadata";
import express from "express";
import { Container } from "typedi";
import { PurchaseController } from "@/controller/purchase.controller";
import auth from "@/middleware/auth.middleware";
import { UserRoles } from "@/enums/user-roles";
export default (router: express.Router) => {
  const purchaseController = Container.get(PurchaseController);
  router.post("/purchase", auth([UserRoles.DEFAULT]), (req, res, next) => purchaseController.purchaseProduct(req, res, next));
};
