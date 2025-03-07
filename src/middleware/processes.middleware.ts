import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import express, { Express } from "express";
import cookieParser from "cookie-parser";

const configureProcessesMiddleware = async (app: Express) => {
  // enable cors
  app.use(
    cors({
      credentials: true,
    })
  );

  // Set Proxy
  app.set("trust proxy", true);

  // Enable HTTP request logging
  app.use(morgan("common"));

  app.use(compression());

  // Parse HTTP request cookie Header to JSON
  app.use(cookieParser());

  // Secure the app by setting various HTTP headers off.
  app.use(helmet({ contentSecurityPolicy: false }));

  // Tell express to recognize the incoming Request Object as a JSON Object
  app.use(express.json());
};

export default configureProcessesMiddleware;
