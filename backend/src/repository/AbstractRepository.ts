import {Model, Document, Schema, model} from "mongoose";
import {RequestConflictError} from "../utils/exception/JobLogError";

// https://mongoosejs.com/docs/typescript.html

export default abstract class AbstractRepository<T extends Document> {
  protected model: Model<T>;
  protected modelName: string;

  protected constructor(schema: Schema<T>, modelName: string) {
    this.model = model<T>(modelName, schema);
    this.modelName = modelName;
  }

  public async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  public async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  public async create(item: T): Promise<T> {
    try {
      return await this.model.create(item);
    } catch (error: unknown) {
      this.handleMongoError(this.modelName, error);
      throw error;
    }
  }

  // Partial<T> allow partial update in mongoose
  // https://mongoosejs.com/docs/api/model.html#Model.findByIdAndUpdate()
  public async update(id: string, item: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, item, {new: true}).exec();
  }

  public async delete(id: string): Promise<void> {
    const result: T | null = await this.model.findByIdAndDelete(id).exec();
    console.log(result !== null);
  }

  protected handleMongoError(schemaName: string, error: unknown) {
    if (error instanceof Error && error.message.includes("E11000")) {
      throw new RequestConflictError(schemaName + " Already exists");
    }
  }
}
