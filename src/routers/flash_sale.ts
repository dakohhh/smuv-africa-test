import "reflect-metadata";
import express from "express";
import { Container } from "typedi";
import { FlashSaleController } from "@/controller/flash_sale.controller";
import auth from "@/middleware/auth.middleware";
import { UserRoles } from "@/enums/user-roles";

export default (router: express.Router) => {
  const flashSaleController = Container.get(FlashSaleController);
  router.post("/flash-sale", auth([UserRoles.DEFAULT]), (req, res, next) => flashSaleController.startFlashSale(req, res, next));
  router.put("/flash-sale/:flashSaleId/end", auth([UserRoles.DEFAULT]), (req, res, next) => flashSaleController.endFlashSale(req, res, next));
  router.put("/flash-sale/:flashSaleId/restart", auth([UserRoles.DEFAULT]), (req, res, next) => flashSaleController.restartFlashSale(req, res, next));

  // Fetch current and upcoming flash sale products
  router.get("/flash-sale/current", (req, res, next) => flashSaleController.getCurrentFlashSaleProducts(req, res, next));
  router.get("/flash-sale/upcoming", (req, res, next) => flashSaleController.getUpcomingFlashSaleProducts(req, res, next));
};
