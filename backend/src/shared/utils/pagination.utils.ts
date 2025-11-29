export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Calculate pagination metadata
 */
export const calculatePagination = (
  totalItems: number,
  page: number,
  pageSize: number,
): PaginationMeta => {
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    page,
    pageSize,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

/**
 * Calculate skip value for Prisma
 */
export const calculateSkip = (page: number, pageSize: number): number => {
  return (page - 1) * pageSize;
};

/**
 * Validate and sanitize pagination params
 */
export const sanitizePaginationParams = (page?: number, pageSize?: number): PaginationParams => {
  const sanitizedPage = Math.max(1, page || 1);
  const sanitizedPageSize = Math.min(100, Math.max(1, pageSize || 20)); // Max 100 items per page

  return {
    page: sanitizedPage,
    pageSize: sanitizedPageSize,
  };
};
