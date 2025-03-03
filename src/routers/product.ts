import "reflect-metadata";
import express from "express";
import { Container } from "typedi";
import { ProductController } from "@/controller/product.controller";
import { UserRoles } from "@/enums/user-roles";
import auth from "@/middleware/auth.middleware";
export default (router: express.Router) => {
  const productController = Container.get(ProductController);
  router.post("/product/", auth([UserRoles.DEFAULT]), (req, res, next) => productController.createProduct(req, res, next));
  router.get("/product/", auth([UserRoles.DEFAULT]), (req, res, next) => productController.getProducts(req, res, next));
};
