import ResponseCodeMsg from "../constant/ResponseCodeMsg";

export class UnauthorizedError extends Error {
  public readonly code = ResponseCodeMsg.UNAUTHORIZED_REQUEST_CODE;

  constructor(message?: string) {
    super(ResponseCodeMsg.UNAUTHORIZED_REQUEST_MSG + message);
  }
}

export class NotFoundError extends Error {
  public readonly code = ResponseCodeMsg.NOT_FOUND_CODE;

  constructor(message?: string) {
    super(ResponseCodeMsg.NOT_FOUND_MSG + message);
  }
}

export class RequestConflictError extends Error {
  public readonly code = ResponseCodeMsg.REQUEST_CONFLICT_CODE;

  constructor(message?: string) {
    super(ResponseCodeMsg.REQUEST_CONFLICT_MSG + message);
  }
}

export class BadRequestError extends Error {
  public readonly code = ResponseCodeMsg.BAD_REQUEST_ERROR_CODE;

  constructor(message?: string) {
    super(ResponseCodeMsg.BAD_REQUEST_ERROR_MSG + message);
  }
}
