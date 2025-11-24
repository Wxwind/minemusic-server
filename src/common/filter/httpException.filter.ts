import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Response } from 'express';
import { ResponseInfo } from '../api/responseInfo';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const resp = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const body: ResponseInfo = {
      code: status,
      msg: exception.message,
    };
    this.logger.error(exception.message, exception.stack);
    resp.status(status).json(body);
  }
}
