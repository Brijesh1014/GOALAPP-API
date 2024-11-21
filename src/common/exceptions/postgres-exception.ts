import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';

@Catch(QueryFailedError)
export class PostgresExceptionFilter implements ExceptionFilter {
  catch(
    exception: QueryFailedError<{ code: string; detail: string } & Error>,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Customize your error message based on the error code
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error';

    switch (exception.driverError.code) {
      case '23505': // Unique violation
        statusCode = HttpStatus.CONFLICT;
        message = 'Duplicate entry error';
        break;
      case '23503': // Foreign key violation
        statusCode = HttpStatus.BAD_REQUEST;
        message = 'Invalid foreign key reference';
        break;
      case '23502': // Not null violation
        statusCode = HttpStatus.BAD_REQUEST;
        message = 'Required field missing';
        break;
      // Add other Postgres error codes here as needed
      default:
        message = 'Unexpected database error occurred';
    }

    response.status(statusCode).json({
      message,
      error: exception.driverError.detail || message,
      statusCode,
    });
  }
}
