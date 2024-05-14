import { Request, Response, Router } from "express";
import express = require("express");
import multer = require("multer");
import path = require("path");
import fs = require("fs");
import { FileController } from "../controller/FileController";
import { fileFilter } from "../middleware/file";

const upload = multer({ dest: "uploads/" }); // Folder to save downloaded files

class FileRouter {
  private router: Router;
  private controller;

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

  async downloadFile(req: Request, res: Response, next: express.NextFunction) {
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
      // We send the file to the client for downloading
      res.download(filePath);
    } catch (error) {
      console.error("Error while uploading file:", error);
      res.status(500).send("Server error");
    }
  }

  async uploadFile(req: Request, res: Response, next: express.NextFunction) {
    try {
      // Проверяем, загружен ли файл
      if (!req.file) {
        return res.status(400).send("Файл не был загружен.");
      }

      await this.controller.upload(req.file, next);

      res.send("Файл успешно загружен и обработан.");
    } catch (error) {
      console.error("Ошибка при загрузке файла:", error);
      res.status(500).send("Произошла ошибка при загрузке файла.");
    }
  }

  async getAll(req: Request, res: Response, next: express.NextFunction) {
    const fails = await this.controller.all(req, res, next);

    res.json(fails);
  }

  async create(req: Request, res: Response, next: express.NextFunction) {
    throw "method not support";
  }

  getRouter() {
    return this.router;
  }
}

export default FileRouter;
