import { Request, Response, Router, NextFunction } from "express";
import express = require("express");
import multer = require("multer");
import path = require("path");
import fs = require("fs");
import { FileController } from "../controller/FileController";
import { fileFilter } from "../middleware/file";

const upload = multer({ dest: "uploads/" }); // Folder to save downloaded files

class FileRouter {
  private router: Router;
  private controller: FileController;

  constructor() {
    this.router = express.Router();
    this.controller = new FileController();

    this.router.get("/", this.getAll.bind(this));
    this.router.post(
      "/upload",
      fileFilter,
      upload.single("zipfile"),
      this.uploadFile.bind(this)
    );
    this.router.get("/:filename", this.downloadFile.bind(this));
  }

  async downloadFile(req: Request, res: Response, next: NextFunction) {
    try {
      const fileName = req.params.filename;
      const filePath = path.join(__dirname, "../..", "extracted", fileName);
      const fileExists = await fs.promises
        .access(filePath, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false);

      if (!fileExists) {
        return res.status(404).send("File not found");
      }

      res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader("Content-Length", fs.statSync(filePath).size);
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Pragma", "no-cache");

      res.download(filePath);
    } catch (error) {
      console.error("Error while uploading file:", error);
      res.status(500).send("Server error");
    }
  }

  async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).send("File was not uploaded.");
      }

      await this.controller.upload(req.file, next);

      res.send("File uploaded and processed successfully.");
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).send("An error occurred while uploading the file.");
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const fails = await this.controller.all(req, res, next);
      res.json(fails);
    } catch (error) {
      console.error("Error retrieving files:", error);
      res.status(500).send("An error occurred while retrieving files.");
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    return res.status(405).send("Method Not Allowed");
  }

  getRouter() {
    return this.router;
  }
}

export default FileRouter;
