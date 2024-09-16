import AbstractController from "./AbstractController";
import {IUser} from "../model/User";
import UserService from "../service/UserService";
import {Request, Response} from "express";
import {generateJwtToken} from "../utils/Authenticator";
import {authenticator} from "../App";

export default class UserController extends AbstractController<IUser> {
  private userService: UserService;

  constructor(userService: UserService) {
    super();
    this.userService = userService;
  }

  public getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userName = req.query.userName?.toString();
      if (userName) {
        const result = await this.userService.getByUserName(userName);
        const updateResult = {userName: result.username, securityQuestion: result.securityQuestion};
        return this.onResolve(res, updateResult);
      }
      return this.onResolve(res, "Not implement");
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  public getById = async (req: Request, res: Response): Promise<Response> => {
    try {
      return this.onResolve(res, "Not implement");
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  public create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = await this.userService.create(req.body);
      return this.onResolve(res, await generateJwtToken(user));
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  public login = async (req: Request, res: Response): Promise<Response> => {
    try {
      return this.onResolve(res, await this.userService.login(req.body));
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  public update = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (req.body.password) {
        return this.onResolve(res, await this.userService.resetPassword(req.body));
      }
      const currentUser = await authenticator.getCurrentUser(req.headers.authorization);
      return this.onResolve(res, await this.userService.update(currentUser.id, req.body));
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  public delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      return this.onResolve(res, "Not implement");
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}
