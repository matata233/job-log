import AbstractController from "./AbstractController";
import {IJobBoard} from "../model/JobBoard";
import JobBoardService from "../service/JobBoardService";
import {Request, Response} from "express";
import {authenticator} from "../App";

export default class JobBoardController extends AbstractController<IJobBoard> {
  private jobBoardService: JobBoardService;

  constructor(jobBoardService: JobBoardService) {
    super();
    this.jobBoardService = jobBoardService;
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
      const currentUser = await authenticator.getCurrentUser(req.headers.authorization);
      return this.onResolve(res, await this.jobBoardService.getAllByUserId(currentUser.id));
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  public getById = async (req: Request, res: Response): Promise<Response> => {
    try {
      await authenticator.getCurrentUser(req.headers.authorization);
      return this.onResolve(res, await this.jobBoardService.getById(req.params.id));
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  public create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const currentUser = await authenticator.getCurrentUser(req.headers.authorization);
      req.body.userId = currentUser.id;
      return this.onResolve(res, await this.jobBoardService.create(req.body));
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  public update = async (req: Request, res: Response): Promise<Response> => {
    try {
      await authenticator.getCurrentUser(req.headers.authorization);
      return this.onResolve(res, await this.jobBoardService.update(req.params.id, req.body));
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  public updateStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
      await authenticator.getCurrentUser(req.headers.authorization);
      if (req.body.oldStatus === undefined) {
        return this.onResolve(res, "");
      }
      if (req.body.newStatus === undefined) {
        return this.onResolve(res, await this.jobBoardService.removeStatus(req.params.id, req.body.oldStatus));
      }
      // force mongo NOT generate a new ID for the new status
      req.body.newStatus._id = req.body.oldStatus.id;
      return this.onResolve(
        res,
        await this.jobBoardService.renameStatus(req.params.id, req.body.oldStatus, req.body.newStatus)
      );
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  public delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      await authenticator.getCurrentUser(req.headers.authorization);
      await this.jobBoardService.delete(req.params.id);
      return this.onResolve(res, "");
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}
