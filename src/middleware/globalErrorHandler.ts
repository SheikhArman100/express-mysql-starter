import { Prisma } from '@prisma/client';
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../config';
import ApiError from '../errors/ApiError';
import handleValidationError from '../errors/handleValidationError';
import handleZodError from '../errors/handleZodError';
import { IGenericErrorMessages } from '../interfaces/error';
import logger from '../shared/logger';

/**
 * Global error handler for Express, tailored for Prisma, Zod, and TypeScript.
 * Catches and standardizes all errors occurring in the API.
 */
const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.error('globalErrorHandler:', error);

  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorMessages: IGenericErrorMessages[] = [];

  // Common log data structure
  const logData = {
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id || 'unauthenticated',
    stack: error?.stack,
  };

  if (error instanceof Prisma.PrismaClientValidationError) {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;

    logger.error(`Prisma Validation Error: ${message}`, {
      ...logData,
      errorMessages,
      errorName: error.name,
      errorDetails: error,
    });
  } else if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  ) {
    statusCode = 400;
    const target = error.meta?.target;
    let fields: string[] = [];

    if (Array.isArray(target)) {
      fields = target;
    } else if (typeof target === 'string') {
      const parts = target.split('_');
      if (parts.length > 1 && parts[parts.length - 1] === 'key') {
        fields = parts.slice(1, -1);
      }
      if (fields.length === 0) {
        fields = [target];
      }
    }

    if (fields.length === 0) {
      fields = ['unknown'];
    }

    message = `Duplicate key error: ${fields.join(', ')} already exists.`;
    errorMessages = fields.map(key => ({
      path: key,
      message: `${key} already exists.`,
    }));

    logger.error(`Prisma Duplicate Key Error: ${message}`, {
      ...logData,
      errorMessages,
      code: error.code,
      target: error.meta?.target,
    });
  } else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;

    logger.error(`Zod Validation Error: ${message}`, {
      ...logData,
      errorMessages,
      zodIssues: error.issues,
    });
  } else if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errorMessages = error.message ? [{ path: '', message: error.message }] : [];

    if (statusCode >= 500) {
      logger.error(`API Error (${statusCode}): ${message}`, {
        ...logData,
        errorMessages,
      });
    } else {
      logger.warn(`API Error (${statusCode}): ${message}`, {
        ...logData,
        errorMessages,
      });
    }
  } else if (error instanceof Error) {
    message = error.message;
    errorMessages = error.message ? [{ path: '', message: error.message }] : [];

    logger.error(`Uncaught Exception: ${message}`, {
      ...logData,
      errorMessages,
      name: error.name,
    });
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorMessages,
    stack: config.env !== 'production' ? error.stack : undefined,
  });
  next();
};

export default globalErrorHandler;
