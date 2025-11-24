import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ResponseInfo } from '../api/responseInfo';

@Injectable()
export class GlobalResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const resp: ResponseInfo = {
          code: 0,
          msg: '',
          data,
        };
        return resp;
      })
    );
  }
}
