import AbstractService from "./AbstractService";
import {IFile} from "../model/File";
import FileRepository from "../repository/FileRepository";
import {NotFoundError} from "../utils/exception/JobLogError";
import {s3Service} from "../utils/S3service";

/**
 * S3 reference:
 * https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html
 */
export default class FileService extends AbstractService<IFile> {
  private fileRepo: FileRepository;
  private s3service = new s3Service(process.env.BUCKET_NAME!);

  constructor(fileRepo: FileRepository) {
    super();
    this.fileRepo = fileRepo;
  }

  public async getAll(): Promise<IFile[]> {
    return Promise.reject("Not implement");
  }

  public async getAllByUserId(id: string): Promise<IFile[]> {
    return await this.fileRepo.findAllByUserId(id);
  }

  public async getAllByJobPostId(jobPostId: string): Promise<IFile[]> {
    return await this.fileRepo.findAllByJobPostId(jobPostId);
  }

  public async getAllByUserIdAndCategory(id: string, category: string): Promise<IFile[]> {
    return await this.fileRepo.findAllByUserIdAndCategory(id, category);
  }

  public async getAllByJobPostIdAndCategory(id: string, category: string): Promise<IFile[]> {
    return await this.fileRepo.findAllByJobPostIdAndCategory(id, category);
  }

  public async getById(id: string): Promise<IFile> {
    const result = await this.fileRepo.findById(id);
    if (!result) {
      throw new NotFoundError("File not found");
    }
    return result;
  }

  public async create(dto: IFile): Promise<IFile> {
    return await this.fileRepo.create(dto);
  }

  public async upload(file: Express.Multer.File): Promise<string> {
    return await this.s3service.uploadFile(file);
  }

  public async update(id: string, dto: IFile): Promise<IFile> {
    // Update will only allow to change the original name, category, linked job post id of the file
    // Exclude them from the update data using js object destructing
    const {fileUrl, fileType, storedFileName, ...updateData} = dto;
    const result = await this.fileRepo.update(id, updateData);
    if (!result) {
      throw new NotFoundError("File not found");
    }
    return result;
  }

  public async delete(id: string): Promise<void> {
    const result = await this.fileRepo.findById(id);
    if (!result) {
      throw new NotFoundError("File not found");
    }
    await this.s3service.removeFile(result.storedFileName);
    await this.fileRepo.delete(id);
  }
}
