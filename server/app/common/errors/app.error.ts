import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { type Request, type Response } from 'express';

// -------------------------
// Response Code 정의
// -------------------------
export interface ResponseCode {
  code: string;
  msg: string;
  info: string;
  status: number;
}

export const SUCCESS: ResponseCode = Object.freeze({ code: '00', msg: 'NORMAL_CODE', info: '정상 처리', status: 200 });
export const NOT_REGISTERED_ERROR: ResponseCode = Object.freeze({ code: 'E01', msg: 'Not Registered Error', info: '아이디나 비밀번호가 틀렸습니다.', status: 400 });
export const UNAUTHORIZED_ERROR: ResponseCode = Object.freeze({ code: 'E02', msg: 'Unauthorized Error', info: '로그인이 필요한 서비스입니다.', status: 401 });
export const FORBIDDEN_ERROR: ResponseCode = Object.freeze({ code: 'E03', msg: 'Forbidden Error', info: '권한이 부족하여 제공할 수 없는 서비스입니다.', status: 403 });
export const EXPIRED_TOKEN_ERROR: ResponseCode = Object.freeze({ code: 'E05', msg: 'Invalid Token Error', info: '만료된 토큰입니다.', status: 401 });
export const INVALID_TOKEN_ERROR: ResponseCode = Object.freeze({ code: 'E06', msg: 'Invalid Token Error', info: '유효한 토큰이 아닙니다.', status: 401 });
export const CONFLICT_ERROR: ResponseCode = Object.freeze({ code: 'E07', msg: 'Conflict Error', info: '이미 가입 된 회원입니다.', status: 409 });
export const UNMATCHING_USER_ERROR: ResponseCode = Object.freeze({ code: 'E08', msg: 'Unmatching User Error', info: '로그인한 유저로는 수행할 수 없는 작업입니다.', status: 403 });
export const REISSUE_ERROR: ResponseCode = Object.freeze({ code: 'E09', msg: 'Reissue Error', info: '재발급 불가능합니다.', status: 401 });
export const NOT_FOUND_ERROR: ResponseCode = Object.freeze({ code: 'E20', msg: 'Not Found Error', info: '제공되지 않는 서비스입니다.', status: 404 });
export const BAD_REQUEST_ERROR: ResponseCode = Object.freeze({ code: 'E21', msg: 'Bad Request Error', info: '요청 파라미터에 이상이 있습니다.', status: 400 });
export const BAD_FILE_ERROR: ResponseCode = Object.freeze({ code: 'E22', msg: 'Bad File Error', info: '파일은 필수(10MB이하)입니다.', status: 400 });
export const CORS_ERROR: ResponseCode = Object.freeze({ code: 'E70', msg: 'CORS Error', info: '허용하지 않는 도메인 입니다.', status: 403 });
export const DB_ERROR: ResponseCode = Object.freeze({ code: 'E80', msg: 'DB Error', info: '서비스 제공 상태가 원활하지 않습니다.', status: 500 });
export const SYSTEM_ERROR: ResponseCode = Object.freeze({ code: 'E99', msg: 'Application Error', info: '서비스 제공 상태가 원활하지 않습니다.', status: 500 });

// -------------------------
// AppError 클래스 & 편의 함수
// -------------------------
export class AppError extends HttpException {
  readonly codeInfo: ResponseCode;

  constructor(msg: string, codeInfo: ResponseCode = SYSTEM_ERROR) {
    super({ message: msg, code: codeInfo.code }, codeInfo.status);
    this.codeInfo = codeInfo;
  }
}

export const notFoundError = (msg = NOT_FOUND_ERROR.info) => new AppError(msg, NOT_FOUND_ERROR);
export const unauthorizedError = (msg = UNAUTHORIZED_ERROR.info) => new AppError(msg, UNAUTHORIZED_ERROR);
export const forbiddenError = (msg = FORBIDDEN_ERROR.info) => new AppError(msg, FORBIDDEN_ERROR);
export const badRequestError = (msg = BAD_REQUEST_ERROR.info) => new AppError(msg, BAD_REQUEST_ERROR);
export const conflictError = (msg = CONFLICT_ERROR.info) => new AppError(msg, CONFLICT_ERROR);
export const unmatchingUserError = (msg = UNMATCHING_USER_ERROR.info) => new AppError(msg, UNMATCHING_USER_ERROR);
export const notRegisteredError = (msg = NOT_REGISTERED_ERROR.info) => new AppError(msg, NOT_REGISTERED_ERROR);
export const systemError = (msg = SYSTEM_ERROR.info) => new AppError(msg, SYSTEM_ERROR);

// -------------------------
// 상태코드 → ResponseCode 매핑
// -------------------------
const STATUS_TO_RESPONSE_CODE: Record<number, ResponseCode> = {
  400: BAD_REQUEST_ERROR,
  401: UNAUTHORIZED_ERROR,
  403: FORBIDDEN_ERROR,
  404: NOT_FOUND_ERROR,
  409: CONFLICT_ERROR,
  500: SYSTEM_ERROR,
};

// -------------------------
// GlobalExceptionFilter
// -------------------------
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const rawMessage =
      exception instanceof HttpException ? exception.getResponse() : null;

    const customInfo =
      typeof rawMessage === 'object' && rawMessage !== null && 'message' in rawMessage
        ? (rawMessage as { message: string }).message
        : typeof rawMessage === 'string'
        ? rawMessage
        : null;

    const responseCode =
      exception instanceof AppError
        ? exception.codeInfo
        : (STATUS_TO_RESPONSE_CODE[status] ?? SYSTEM_ERROR);

    const errorResponse = {
      code: responseCode.code,
      msg: responseCode.msg,
      info: customInfo ?? responseCode.info,
      status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

if (status === 500) {
  this.logger.error(
    `${request.method} ${request.url} ${status}`,
    exception instanceof Error ? exception.stack : String(exception),
  );
} else {
  this.logger.warn(
    `${request.method} ${request.url} ${status}`,
    exception instanceof Error ? exception.message : String(exception),
  );
}

    response.status(status).json(errorResponse);
  }
}
