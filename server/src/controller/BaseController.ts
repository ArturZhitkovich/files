import { Repository, DeepPartial, EntityTarget } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";

export abstract class BaseController<T> {
  protected repository: Repository<T>;
  protected entityName: string;

  constructor(entity: EntityTarget<T>) {
    this.repository = AppDataSource.getRepository(entity);
    this.entityName = "Entity";
  }

  async all(request: Request, response: Response, next: NextFunction) {
    try {
      const entities = await this.repository.find();

      return entities;
    } catch (error) {
      return next(error);
    }
  }

  async one(request: Request, response: Response, next: NextFunction) {
    try {
      const id = parseInt(request.params.id);
      // @ts-ignore
      const entity = await this.repository.findOne(id);

      if (!entity) {
        return response
          .status(404)
          .json({ message: `${this.entityName} not found` });
      }

      return entity;
    } catch (error) {
      return next(error);
    }
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const data: DeepPartial<T> = request.body;
      const entity = this.repository.create(data);
      await this.repository.save(entity);
      return response.status(201).json(entity);
    } catch (error) {
      return next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const id = parseInt(request.params.id);
      const data: DeepPartial<T> = request.body;
      // @ts-ignore
      await this.repository.update(id, data);
      // @ts-ignore
      const updatedEntity = await this.repository.findOne(id);

      if (!updatedEntity) {
        return response
          .status(404)
          .json({ message: `${this.entityName} not found` });
      }

      return updatedEntity;
    } catch (error) {
      return next(error);
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const id = parseInt(request.params.id);
      // @ts-ignore
      const entityToRemove = await this.repository.findOne(id);

      if (!entityToRemove) {
        return response
          .status(404)
          .json({ message: `${this.entityName} not found` });
      }

      await this.repository.remove(entityToRemove);

      return response.json({
        message: `${this.entityName} removed successfully`,
      });
    } catch (error) {
      return next(error);
    }
  }
}
