import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Inject, LoggerService } from '@nestjs/common';
import { Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ResponseInfo } from '../api/responseInfo';

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    const body: ResponseInfo = {
      code: status,
      msg: exception.message,
    };
    this.logger.error(exception.message, exception.stack);
    response.status(status).json(body);
  }
}
