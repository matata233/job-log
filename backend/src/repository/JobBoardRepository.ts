import AbstractRepository from "./AbstractRepository";
import {IJobBoard, jobBoardSchema, jobBoardSchemaName} from "../model/JobBoard";

export default class JobBoardRepository extends AbstractRepository<IJobBoard> {
  constructor() {
    super(jobBoardSchema, jobBoardSchemaName);
  }

  public async findAllByUserId(id: string): Promise<IJobBoard[]> {
    return this.model.find({userId: id}).exec();
  }
}
