import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import multer = require("multer");
import FileRouter from "./routes/FileRoute";
import path = require("path");
import ZipRouter from "./routes/ZipRouter";
const cors = require("cors");

AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express();
    app.use(bodyParser.json());

    const fileRouter = new FileRouter();
    const zipRouter = new ZipRouter();

    app.use("/files", fileRouter.getRouter());
    app.use("/generate-zip", zipRouter.getRouter());
    // setup express app here
    app.use(cors());

    app.use((err, req, res, next) => {
      console.error("Error:", err);
      res.status(500).send("Internal Server Error");
    });

    // start express server
    app.listen(3000);

    console.log(
      "Express server has started on port 3000. Open http://localhost:3000/files to see results"
    );
  })
  .catch((error) => console.log(error));
