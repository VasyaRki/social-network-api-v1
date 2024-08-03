import {
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { DomainError } from './domain.error';

@Catch(WsException, HttpException, DomainError)
export class GlobalExceptionFilter implements GqlExceptionFilter {
  private readonly internalServerError = new Error('Internal server error');

  constructor() {
    this.internalServerError.name = 'INTERNAL_SERVER_ERROR';
  }

  catch(error: HttpException | WsException, host: ArgumentsHost) {
    const exception =
      error instanceof DomainError || UnauthorizedException
        ? error
        : this.internalServerError;

    if (error instanceof WsException) {
      const ctx = host.switchToWs();
      const client = ctx.getClient();

      client.emit('exception', exception);
    }

    return exception;
  }
}
