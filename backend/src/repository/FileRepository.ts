import AbstractRepository from "./AbstractRepository";
import {fileSchema, fileSchemaName, IFile} from "../model/File";

export default class FileRepository extends AbstractRepository<IFile> {
  constructor() {
    super(fileSchema, fileSchemaName);
  }

  public async findAllByUserId(userId: string): Promise<IFile[]> {
    return this.model.find({userId: userId}).exec();
  }

  public async findAllByJobPostId(jobPostId: string): Promise<IFile[]> {
    return this.model.find({jobPostId: jobPostId}).exec();
  }

  public async findAllByUserIdAndCategory(userId: string, category: string): Promise<IFile[]> {
    return this.model.find({userId: userId, category: category}).exec();
  }

  public async findAllByJobPostIdAndCategory(jobPostId: string, category: string): Promise<IFile[]> {
    return this.model.find({jobPostId: jobPostId, category: category}).exec();
  }
}
