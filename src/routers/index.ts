import user from "./user";
import express from "express";
import product from "./product";
import authentication from "./authentication";
import flashSale from "./flash_sale";
import purchase from "./purchase";
import leaderboard from "./leaderboard";
const router = express.Router();

export default (): express.Router => {
  user(router);
  product(router);
  flashSale(router);
  purchase(router);
  leaderboard(router);
  authentication(router);

  return router;
};
