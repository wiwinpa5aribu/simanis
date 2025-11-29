import { PaginationMeta } from './pagination.utils';

/**
 * Standard success response format
 */
export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

/**
 * Standard error response format
 */
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Create success response
 */
export const createSuccessResponse = <T>(data: T, meta?: PaginationMeta): SuccessResponse<T> => {
  const response: SuccessResponse<T> = {
    success: true,
    data,
  };

  if (meta) {
    response.meta = meta;
  }

  return response;
};

/**
 * Create error response
 */
export const createErrorResponse = (
  code: string,
  message: string,
  details?: unknown,
): ErrorResponse => {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
  };
};
