import {Document} from "mongoose";

export default abstract class AbstractService<T extends Document> {
  public abstract getAll(): Promise<T[]>;

  public abstract getById(id: string): Promise<T>;

  public abstract create(dto: T): Promise<T>;

  public abstract update(id: string, dto: T): Promise<T>;

  public abstract delete(id: string): Promise<void>;
}
