import "reflect-metadata";
import express from "express";
import { Container } from "typedi";
import { LeaderboardController } from "@/controller/leaderboard.controller";

export default (router: express.Router) => {
  const leaderboardController = Container.get(LeaderboardController);
  router.get("/leaderboard", (req, res, next) => leaderboardController.getLeaderboard(req, res, next));
};
