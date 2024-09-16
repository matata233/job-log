export default class ResponseCodeMsg {
  public static OK_CODE = 200;
  public static UNEXPECTED_ERROR_CODE = 500;
  public static UNAUTHORIZED_REQUEST_CODE = 401;
  public static UNAUTHORIZED_REQUEST_MSG = "Unauthorized: ";

  public static BAD_REQUEST_ERROR_CODE = 400;
  public static BAD_REQUEST_ERROR_MSG = "Bad Request: ";

  public static NOT_FOUND_CODE = 404;
  public static NOT_FOUND_MSG = "Not Found: ";

  public static REQUEST_CONFLICT_CODE = 409;
  public static REQUEST_CONFLICT_MSG = "Conflict: ";
}
