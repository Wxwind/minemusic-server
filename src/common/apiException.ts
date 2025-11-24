import { IntrinsicException } from '@nestjs/common';
import { ErrorCode } from './api/errorCode';

export class ApiException extends IntrinsicException {
  constructor(public code: ErrorCode) {
    super();
  }
}
