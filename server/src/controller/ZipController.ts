import fs = require("fs");
import { File } from "../entity/File";
import { Repository } from "typeorm";
import path = require("path");
import AdmZip = require("adm-zip");
import { AppDataSource } from "../data-source";

export class ZipController {
  protected repository: Repository<File>;

  constructor() {
    this.repository = AppDataSource.getRepository(File);
  }

  async addFileToArchive(fileNames: string[]) {
    const zip = new AdmZip();
    const promises = [];

    for (let filename of fileNames) {
      const filePath = path.join(__dirname, "../..", "extracted", filename);

      const readFilePromise = new Promise<void>((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
          if (err) {
            console.error("Ошибка чтения файла:", err);
            reject(err);
          } else {
            zip.addFile(filename, data);
            resolve();
          }
        });
      });

      promises.push(readFilePromise);
    }

    await Promise.all(promises);

    await zip.writeZip("./extracted/archive.zip", (err) => {
      if (err) {
        console.error("Ошибка при создании zip-архива:", err);
        return;
      }
      console.log("Zip-архив успешно создан.");
    });
  }
  async createArchive(ids: number[]) {
    const DBFiles = await this.repository
      .createQueryBuilder("file")
      .where("file.id IN (:...ids)", { ids })
      .orderBy("file.createdDate")
      .getMany();

    await this.addFileToArchive(DBFiles.map((f) => f.fileName));

    return "archive.zip";
  }
}
