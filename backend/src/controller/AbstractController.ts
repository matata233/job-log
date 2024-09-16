import ResponseCodeMsg from "../utils/constant/ResponseCodeMsg";
import {Request, Response} from "express";
import {Document} from "mongoose";
import {BadRequestError, NotFoundError, RequestConflictError, UnauthorizedError} from "../utils/exception/JobLogError";

export default abstract class AbstractController<T extends Document> {
  public abstract getAll(req: Request, res: Response): Promise<Response>;

  public abstract getById(req: Request, res: Response): Promise<Response>;

  public abstract create(req: Request, res: Response): Promise<Response>;

  public abstract update(req: Request, res: Response): Promise<Response>;

  public abstract delete(req: Request, res: Response): Promise<Response>;

  protected onResolve(res: Response, result: Partial<T> | Partial<T>[] | string): Response {
    return res.status(ResponseCodeMsg.OK_CODE).json({result: result});
  }

  protected handleError(res: Response, error: unknown): Response {
    let errorCode, errorMsg;
    if (
      error instanceof UnauthorizedError ||
      error instanceof BadRequestError ||
      error instanceof NotFoundError ||
      error instanceof RequestConflictError
    ) {
      errorCode = error.code;
      errorMsg = error.message;
    } else if (error instanceof Error) {
      errorCode = ResponseCodeMsg.UNEXPECTED_ERROR_CODE;
      errorMsg = error.message;
      // a work-around for mongoose error handling
      if (error.message.includes("validation failed")) {
        errorCode = ResponseCodeMsg.BAD_REQUEST_ERROR_CODE;
        errorMsg = ResponseCodeMsg.BAD_REQUEST_ERROR_MSG + error.message;
      }
    } else {
      errorCode = ResponseCodeMsg.UNEXPECTED_ERROR_CODE;
      errorMsg = "An unknown error occurred.";
    }
    return onReject(res, errorCode, errorMsg);
  }
}

function onReject(res: Response, code: number, msg: string): Response {
  return res.status(code).json({error: msg});
}
