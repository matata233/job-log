import AbstractController from "./AbstractController";
import {Request, Response} from "express";
import {authenticator} from "../App";
import {IJobPost} from "../model/JobPost";
import JobPostService from "../service/JobPostService";

export default class JobPostController extends AbstractController<IJobPost> {
  private jobPostService: JobPostService;

  constructor(jobPostService: JobPostService) {
    super();
    this.jobPostService = jobPostService;
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
      const jobBoardId = req.query.jobBoardId?.toString();
      if (jobBoardId) {
        return this.onResolve(res, await this.jobPostService.getAllByJobBoardId(jobBoardId));
      }
      const currentUser = await authenticator.getCurrentUser(req.headers.authorization);
      return this.onResolve(res, await this.jobPostService.getAllByUserId(currentUser.id));
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  public getById = async (req: Request, res: Response): Promise<Response> => {
    try {
      await authenticator.getCurrentUser(req.headers.authorization);
      return this.onResolve(res, await this.jobPostService.getById(req.params.id));
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  public create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const currentUser = await authenticator.getCurrentUser(req.headers.authorization);
      req.body.userId = currentUser.id;
      return this.onResolve(res, await this.jobPostService.create(req.body));
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  public update = async (req: Request, res: Response): Promise<Response> => {
    try {
      await authenticator.getCurrentUser(req.headers.authorization);
      return this.onResolve(res, await this.jobPostService.update(req.params.id, req.body));
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  public delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      await authenticator.getCurrentUser(req.headers.authorization);
      await this.jobPostService.delete(req.params.id);
      return this.onResolve(res, "");
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}
