import AbstractService from "./AbstractService";
import {IJobBoard, IStatus} from "../model/JobBoard";
import JobBoardRepository from "../repository/JobBoardRepository";
import {BadRequestError, NotFoundError} from "../utils/exception/JobLogError";
import JobPostRepository from "../repository/JobPostRepository";

export default class JobBoardService extends AbstractService<IJobBoard> {
  private jobBoardRepo;
  private jobPostRepo;

  constructor(jobBoardRepo: JobBoardRepository, jobPostRepo: JobPostRepository) {
    super();
    this.jobBoardRepo = jobBoardRepo;
    this.jobPostRepo = jobPostRepo;
  }

  public async getAll(): Promise<IJobBoard[]> {
    return Promise.reject("Not implement");
  }

  public async getAllByUserId(id: string): Promise<IJobBoard[]> {
    return await this.jobBoardRepo.findAllByUserId(id);
  }

  public async getById(id: string): Promise<IJobBoard> {
    const result = await this.jobBoardRepo.findById(id);
    if (!result) {
      throw new NotFoundError("Job Board not found");
    }
    return result;
  }

  public async create(dto: IJobBoard): Promise<IJobBoard> {
    return await this.jobBoardRepo.create(dto);
  }

  public async update(id: string, dto: IJobBoard): Promise<IJobBoard> {
    // should not update status
    const result = await this.jobBoardRepo.update(id, dto);
    if (!result) {
      throw new NotFoundError("Job Board not found");
    }
    return result;
  }

  public async renameStatus(id: string, oldStatus: IStatus, newStatus: IStatus): Promise<IJobBoard> {
    const jobBoard = await this.jobBoardRepo.findById(id);
    if (!jobBoard) {
      throw new NotFoundError("Job Board not found");
    }
    if (jobBoard.statusOrder.some((status) => status.statusName === newStatus.statusName)) {
      throw new BadRequestError("Status name already exists in job board");
    }
    const statusIndex = jobBoard.statusOrder.findIndex((status) => status.statusName === oldStatus.statusName);
    if (statusIndex === -1) {
      throw new NotFoundError("Status not found in job board");
    }
    jobBoard.statusOrder[statusIndex] = newStatus;
    await this.jobPostRepo.updateAllByJobBoardIdAndStatus(id, oldStatus, newStatus);
    return (await this.jobBoardRepo.update(id, jobBoard))!;
  }

  public async removeStatus(id: string, status: IStatus): Promise<IJobBoard> {
    const jobBoard = await this.jobBoardRepo.findById(id);
    if (!jobBoard) {
      throw new NotFoundError("Job Board not found");
    }
    jobBoard.statusOrder = jobBoard.statusOrder.filter((s) => s.statusName !== status.statusName);
    await this.jobPostRepo.archiveAllByJobBoardIdAndStatus(id, status);
    return (await this.jobBoardRepo.update(id, jobBoard))!;
  }

  public async delete(id: string): Promise<void> {
    await this.jobPostRepo.archiveAllByJobBoardId(id);
    await this.jobBoardRepo.delete(id);
  }
}
