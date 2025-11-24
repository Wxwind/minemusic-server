import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Response } from 'express';
import { ResponseInfo } from '../api/responseInfo';
import { ApiException } from '../apiException';
import { ErrorCodeMsg } from '../api/errorCode';

@Catch(ApiException)
export class ApiExceptionFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

  catch(exception: ApiException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const resp = ctx.getResponse<Response>();

    const { code } = exception;
    const body: ResponseInfo = {
      code,
      msg: ErrorCodeMsg[code],
    };

    this.logger.error(exception.message, exception.stack);
    resp.status(HttpStatus.OK).json(body);
  }
}
