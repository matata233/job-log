import AbstractRepository from "./AbstractRepository";
import {IJobPost, jobPostSchema, jobPostSchemaName} from "../model/JobPost";
import {IStatus} from "../model/JobBoard";

export default class JobPostRepository extends AbstractRepository<IJobPost> {
  constructor() {
    super(jobPostSchema, jobPostSchemaName);
  }

  public async findAllByUserId(id: string): Promise<IJobPost[]> {
    return this.model.find({userId: id}).exec();
  }

  public async findAllByJobBoardId(id: string): Promise<IJobPost[]> {
    return this.model.find({jobBoardId: id}).exec();
  }

  public async updateAllByJobBoardIdAndStatus(id: string, oldStatus: IStatus, newStatus: IStatus): Promise<void> {
    const result = await this.model
      .updateMany({jobBoardId: id, "status.statusName": oldStatus.statusName}, {$set: {status: newStatus}}, {new: true})
      .exec();
    console.log(result);
  }

  public async archiveById(id: string): Promise<IJobPost | null> {
    return this.model.findByIdAndUpdate(id, {$set: {isArchived: true}}, {new: true}).exec();
  }

  public async archiveAllByJobBoardId(id: string): Promise<void> {
    await this.model.updateMany({jobBoardId: id}, {$set: {isArchived: true}}).exec();
  }

  public async archiveAllByJobBoardIdAndStatus(id: string, status: IStatus): Promise<void> {
    const result = await this.model
      .updateMany({jobBoardId: id, "status.statusName": status.statusName}, {$set: {isArchived: true}}, {new: true})
      .exec();
    console.log(result);
  }
}
