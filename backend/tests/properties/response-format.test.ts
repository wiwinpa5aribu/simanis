import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { createSuccessResponse, createErrorResponse } from '../../src/shared/utils/response.utils';
import { calculatePagination } from '../../src/shared/utils/pagination.utils';

/**
 * Property 10: Response Format Consistency
 * For any successful API response, the structure should be { success: true, data: <payload> }
 * with optional meta for paginated responses.
 */
describe('Property 10: Response Format Consistency', () => {
    it('should always return success: true for success responses', () => {
        fc.assert(
            fc.property(fc.anything(), (data) => {
                const response = createSuccessResponse(data);
                expect(response.success).toBe(true);
                expect(response).toHaveProperty('data');
            })
        );
    });

    it('should include meta when pagination is provided', () => {
        fc.assert(
            fc.property(
                fc.anything(),
                fc.integer({ min: 1, max: 1000 }),
                fc.integer({ min: 1, max: 100 }),
                fc.integer({ min: 1, max: 100 }),
                (data, totalItems, page, pageSize) => {
                    const meta = calculatePagination(totalItems, page, pageSize);
                    const response = createSuccessResponse(data, meta);

                    expect(response.success).toBe(true);
                    expect(response.data).toEqual(data);
                    expect(response.meta).toBeDefined();
                    expect(response.meta).toHaveProperty('page');
                    expect(response.meta).toHaveProperty('pageSize');
                    expect(response.meta).toHaveProperty('totalItems');
                    expect(response.meta).toHaveProperty('totalPages');
                }
            )
        );
    });

    it('should not include meta when not provided', () => {
        fc.assert(
            fc.property(fc.anything(), (data) => {
                const response = createSuccessResponse(data);
                expect(response.meta).toBeUndefined();
            })
        );
    });
});

/**
 * Property 11: Error Response Format Consistency
 * For any failed API response, the structure should be { success: false, error: { code, message } }
 */
describe('Property 11: Error Response Format Consistency', () => {
    it('should always return success: false for error responses', () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 1 }),
                fc.string({ minLength: 1 }),
                (code, message) => {
                    const response = createErrorResponse(code, message);
                    expect(response.success).toBe(false);
                    expect(response.error).toBeDefined();
                    expect(response.error.code).toBe(code);
                    expect(response.error.message).toBe(message);
                }
            )
        );
    });

    it('should include details when provided', () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 1 }),
                fc.string({ minLength: 1 }),
                fc.anything(),
                (code, message, details) => {
                    const response = createErrorResponse(code, message, details);
                    expect(response.success).toBe(false);
                    expect(response.error.details).toEqual(details);
                }
            )
        );
    });
});
