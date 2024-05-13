import { Request, Response, Router } from "express";
import express = require("express");
import { ZipController } from "../controller/ZipController";

class ZipRouter {
  private router: Router;
  private controller;

  constructor() {
    this.router = express.Router();
    this.controller = new ZipController();

    this.router.post("/", this.create.bind(this));
  }

  async create(req: Request, res: Response) {
    try {
      const fileName = await this.controller.createArchive(req.body);

      res.send(fileName);
    } catch (error) {
      console.log("error:", error);
    }
  }

  getRouter() {
    return this.router;
  }
}

export default ZipRouter;
