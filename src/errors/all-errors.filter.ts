import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { SqliteError } from 'better-sqlite3';
@Catch(Error)
export class AllErrorsFilter implements ExceptionFilter {
  private logger = new Logger(AllErrorsFilter.name);

  catch(exception: Error | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof SqliteError) {
      this.logger.error(exception);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'DB query error',
        error: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    this.logger.error(exception);
    if (exception instanceof HttpException) {
      // jeżeli to NestJS'owy błąd, instancja HttpException, to obsłuż ją tak jak do tej pory:
      response.status(exception.getStatus()).json(exception.getResponse());
      // nie idź dalej, żeby nie zrobić "podwójnego response" na jeden request!
      return;
    }
    // jeśli błąd posiada pole `code` sprawdź, czy to nie file-system error
    if (
      [
        'EACCES',
        'EEXIST',
        'ENOENT',
        'ENOTDIR',
        'ENOTEMPTY',
        'EMFILE',
        'EISDIR',
      ].includes(exception?.code)
    ) {
      const responseObj: {
        message: string;
        error: string;
        statusCode: HttpStatus;
        exception?: typeof exception;
      } = {
        message: 'File i/o error (check logs)',
        error: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };

      if (process.env.NODE_ENV === 'development') {
        responseObj.exception = exception;
      }

      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(responseObj);
    }
    // Jeśli to nieznany błąd (inny niż HttpException):
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Unknown error',
      error: 'Internal Server Error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
