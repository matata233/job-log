import AbstractController from "./AbstractController";
import {IFile} from "../model/File";
import {Request, Response} from "express";
import FileService from "../service/FileService";
import {authenticator} from "../App";
import {BadRequestError} from "../utils/exception/JobLogError";

export default class FileController extends AbstractController<IFile> {
  private fileService: FileService;

  constructor(fileService: FileService) {
    super();
    this.fileService = fileService;
  }

  public getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      return this.onResolve(res, "Not implement");
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  public getAllByUserId = async (req: Request, res: Response): Promise<Response> => {
    try {
      const jobPostId = req.query.jobPostId?.toString();
      const category = req.query.category?.toString();
      const currentUser = await authenticator.getCurrentUser(req.headers.authorization);
      if (jobPostId && category) {
        return this.onResolve(res, await this.fileService.getAllByJobPostIdAndCategory(jobPostId, category));
      }
      if (jobPostId) {
        return this.onResolve(res, await this.fileService.getAllByJobPostId(jobPostId));
      }
      if (category) {
        return this.onResolve(res, await this.fileService.getAllByUserIdAndCategory(currentUser.id, category));
      }
      return this.onResolve(res, await this.fileService.getAllByUserId(currentUser.id));
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  public getById = async (req: Request, res: Response): Promise<Response> => {
    try {
      await authenticator.getCurrentUser(req.headers.authorization);
      return this.onResolve(res, await this.fileService.getById(req.params.id));
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  public create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const currentUser = await authenticator.getCurrentUser(req.headers.authorization);
      const file = req.file;
      if (!file) {
        throw new BadRequestError("No file uploaded.");
      }
      const fileUrl = await this.fileService.upload(file);
      req.body.userId = currentUser.id;
      req.body.originalFileName = file.originalname; // Preserve original file name
      req.body.storedFileName = fileUrl.split("/").pop()!; // Extract the stored file name from the URL
      req.body.fileType = file.mimetype;
      req.body.fileUrl = fileUrl;
      req.body.category = "Default";
      return this.onResolve(res, await this.fileService.create(req.body));
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  public update = async (req: Request, res: Response): Promise<Response> => {
    try {
      await authenticator.getCurrentUser(req.headers.authorization);
      return this.onResolve(res, await this.fileService.update(req.params.id, req.body));
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  public delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      await authenticator.getCurrentUser(req.headers.authorization);
      await this.fileService.delete(req.params.id);
      return this.onResolve(res, "");
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}
