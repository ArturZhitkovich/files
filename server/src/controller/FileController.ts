import fs = require("fs");
import { File } from "../entity/File";
import { BaseController } from "./BaseController";
import { DeepPartial } from "typeorm";
import path = require("path");
import AdmZip = require("adm-zip");
const util = require("util");

const unlink = util.promisify(fs.unlink);
const stat = util.promisify(fs.stat);

export class FileController extends BaseController<File> {
  protected extractFolder: string;

  constructor() {
    super(File);
    this.entityName = "File";
    this.extractFolder = "extracted";
  }

  async checkIsExistsInDB(filename: string): Promise<boolean | number> {
    const results = await this.repository.find({
      where: { fileName: filename },
    });

    return results.length > 0 ? results[0].id : false;
  }

  async checkIsExistsInFS(filename: string): Promise<boolean> {
    try {
      const filePath = path.join(this.extractFolder, filename);
      return fs.existsSync(filePath);
    } catch (error) {
      console.error("Error while checking file existence:", error);
      return false;
    }
  }

  async removeFile(filename: string): Promise<void> {
    try {
      const filePath = path.join(this.extractFolder, filename);
      await unlink(filePath);
    } catch (error) {
      console.error("Error while removing file:", error);
      throw error;
    }
  }

  async readMetadata(filePath: string) {
    try {
      const fullPath = path.join(this.extractFolder, filePath);
      const fileStat = await stat(fullPath);

      return {
        fileName: filePath,
        size: fileStat.size,
        lastModified: fileStat.mtime,
      };
    } catch (err) {
      console.error(`Error reading metadata for ${filePath}:`, err);
      throw err;
    }
  }

  async updateFile(id: number, data: DeepPartial<File>) {
    await this.repository.update({ id }, data);
    return await this.repository.findOneBy({ id: id });
  }

  async saveFile(data: DeepPartial<File>) {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async saveFileInDb(data: DeepPartial<File>) {
    try {
      const isExists = await this.checkIsExistsInDB(data.fileName);
      const entity = isExists
        ? await this.updateFile(Number(isExists), data)
        : await this.saveFile(data);

      return entity;
    } catch (error) {
      throw error;
    }
  }

  async extractFiles(zipFilePath: string): Promise<void> {
    try {
      const zip = new AdmZip(zipFilePath);
      const zipEntries = zip.getEntries();
      const destinationFolder = this.extractFolder;

      for (const zipEntry of zipEntries) {
        const entryName = zipEntry.entryName;

        if (!zipEntry.isDirectory) {
          const isExists = await this.checkIsExistsInFS(entryName);

          if (isExists) {
            await this.removeFile(entryName);
          }

          await zip.extractEntryTo(zipEntry, destinationFolder, false, true);

          console.log("Extracted:", entryName);
          const metadata = await this.readMetadata(entryName);
          const newFile = await this.saveFileInDb(metadata);
          console.log("Save id DB:", newFile);
        }
      }

      console.log("Extraction completed");
    } catch (error) {
      console.error("Error while extracting files:", error);
      throw error;
    }
  }

  async upload(file: Express.Multer.File) {
    try {
      await this.extractFiles(file.path);
      return "Files saved";
    } catch (error) {
      console.error("Error while uploading files:", error);
      throw error;
    }
  }
}
