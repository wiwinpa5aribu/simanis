/**
 * API Error Codes
 *
 * Standardized error codes for consistent API responses
 * These codes help frontend developers handle errors appropriately
 */

export const API_ERROR_CODES = {
  // Authentication & Authorization (1xxx)
  UNAUTHORIZED: 'AUTH_001',
  INVALID_CREDENTIALS: 'AUTH_002',
  TOKEN_EXPIRED: 'AUTH_003',
  FORBIDDEN: 'AUTH_004',
  RATE_LIMITED: 'AUTH_005',

  // Validation Errors (2xxx)
  VALIDATION_ERROR: 'VAL_001',
  INVALID_INPUT: 'VAL_002',
  MISSING_REQUIRED_FIELD: 'VAL_003',
  INVALID_FORMAT: 'VAL_004',

  // Resource Errors (3xxx)
  NOT_FOUND: 'RES_001',
  ALREADY_EXISTS: 'RES_002',
  CONFLICT: 'RES_003',
  RESOURCE_LOCKED: 'RES_004',

  // Database Errors (4xxx)
  DB_ERROR: 'DB_001',
  DB_CONNECTION_ERROR: 'DB_002',
  DB_CONSTRAINT_ERROR: 'DB_003',

  // Business Logic Errors (5xxx)
  ASSET_ALREADY_BORROWED: 'BIZ_001',
  ASSET_DELETED: 'BIZ_002',
  INVENTORY_SESSION_CLOSED: 'BIZ_003',
  INVALID_CONDITION_TRANSITION: 'BIZ_004',

  // Server Errors (9xxx)
  INTERNAL_ERROR: 'SRV_001',
  SERVICE_UNAVAILABLE: 'SRV_002',
  EXTERNAL_SERVICE_ERROR: 'SRV_003',
} as const

export type ApiErrorCode =
  (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES]

/**
 * Standard API Error Response Interface
 */
export interface ApiErrorResponse {
  success: false
  error: {
    code: ApiErrorCode
    message: string
    details?: unknown
    timestamp: string
    path?: string
    requestId?: string
  }
}

/**
 * Standard API Success Response Interface
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true
  data: T
  meta?: {
    page?: number
    pageSize?: number
    total?: number
    totalPages?: number
  }
}

/**
 * Create standardized error response
 */
export function createApiError(
  code: ApiErrorCode,
  message: string,
  details?: unknown,
  path?: string
): ApiErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
      path,
    },
  }
}

/**
 * HTTP Status Code mapping for error codes
 */
export const ERROR_CODE_TO_STATUS: Record<ApiErrorCode, number> = {
  [API_ERROR_CODES.UNAUTHORIZED]: 401,
  [API_ERROR_CODES.INVALID_CREDENTIALS]: 401,
  [API_ERROR_CODES.TOKEN_EXPIRED]: 401,
  [API_ERROR_CODES.FORBIDDEN]: 403,
  [API_ERROR_CODES.RATE_LIMITED]: 429,
  [API_ERROR_CODES.VALIDATION_ERROR]: 400,
  [API_ERROR_CODES.INVALID_INPUT]: 400,
  [API_ERROR_CODES.MISSING_REQUIRED_FIELD]: 400,
  [API_ERROR_CODES.INVALID_FORMAT]: 400,
  [API_ERROR_CODES.NOT_FOUND]: 404,
  [API_ERROR_CODES.ALREADY_EXISTS]: 409,
  [API_ERROR_CODES.CONFLICT]: 409,
  [API_ERROR_CODES.RESOURCE_LOCKED]: 423,
  [API_ERROR_CODES.DB_ERROR]: 500,
  [API_ERROR_CODES.DB_CONNECTION_ERROR]: 503,
  [API_ERROR_CODES.DB_CONSTRAINT_ERROR]: 400,
  [API_ERROR_CODES.ASSET_ALREADY_BORROWED]: 400,
  [API_ERROR_CODES.ASSET_DELETED]: 400,
  [API_ERROR_CODES.INVENTORY_SESSION_CLOSED]: 400,
  [API_ERROR_CODES.INVALID_CONDITION_TRANSITION]: 400,
  [API_ERROR_CODES.INTERNAL_ERROR]: 500,
  [API_ERROR_CODES.SERVICE_UNAVAILABLE]: 503,
  [API_ERROR_CODES.EXTERNAL_SERVICE_ERROR]: 502,
}
