import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor, type LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { getReqMainInfo } from './requestLogger.util';
import { Request, Response } from 'express';

const CONTEXT_NAME = 'RequestLoggerInterceptor';

@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const reqInfo = getReqMainInfo(req);
    this.loggerService.log({ type: 'request', ...reqInfo }, CONTEXT_NAME);
    const start = Date.now();

    return next.handle().pipe(
      tap((data) => {
        const end = Date.now();
        const duration = end - start;
        const resp = ctx.getResponse<Response>();
        this.loggerService.log(
          {
            type: 'response',
            duration,
          },
          CONTEXT_NAME
        );
      }),
      catchError((error) => {
        const end = Date.now();
        const duration = end - start;
        this.loggerService.error(`duration=[${duration}ms]`);
        return throwError(() => error);
      })
    );
  }
}
