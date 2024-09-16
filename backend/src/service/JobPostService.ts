import AbstractService from "./AbstractService";
import {IJobPost} from "../model/JobPost";
import JobPostRepository from "../repository/JobPostRepository";
import {NotFoundError} from "../utils/exception/JobLogError";

export default class JobPostService extends AbstractService<IJobPost> {
  private jobPostRepo;

  constructor(jobPostRepo: JobPostRepository) {
    super();
    this.jobPostRepo = jobPostRepo;
  }

  public async getAll(): Promise<IJobPost[]> {
    return Promise.reject("Not implement");
  }

  public async getAllByUserId(id: string): Promise<IJobPost[]> {
    return await this.jobPostRepo.findAllByUserId(id);
  }

  public async getAllByJobBoardId(id: string): Promise<IJobPost[]> {
    return await this.jobPostRepo.findAllByJobBoardId(id);
  }

  public async getById(id: string): Promise<IJobPost> {
    const result = await this.jobPostRepo.findById(id);
    if (!result) {
      throw new NotFoundError("Job Post not found");
    }
    return result;
  }

  public async create(dto: IJobPost): Promise<IJobPost> {
    return await this.jobPostRepo.create(dto);
  }

  public async update(id: string, dto: IJobPost): Promise<IJobPost> {
    const result = await this.jobPostRepo.update(id, dto);
    if (!result) {
      throw new NotFoundError("Job Post not found");
    }
    return result;
  }

  public async delete(id: string): Promise<void> {
    await this.jobPostRepo.delete(id);
  }
}
