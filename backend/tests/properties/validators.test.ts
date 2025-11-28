import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
    createBuildingSchema,
    updateBuildingSchema,
    createFloorSchema,
    updateFloorSchema,
    createRoomSchema,
    updateRoomSchema,
} from '../../src/application/validators/location.validators';
import { userQuerySchema } from '../../src/application/validators/user.validators';

/**
 * Property Tests for Validators
 * Validates that validators correctly accept valid inputs and reject invalid inputs
 */
describe('Location Validators Properties', () => {
    describe('Building Validators', () => {
        it('should accept valid building names (1-80 chars)', () => {
            fc.assert(
                fc.property(
                    fc.string({ minLength: 1, maxLength: 80 }),
                    (name) => {
                        const result = createBuildingSchema.safeParse({ name });
                        expect(result.success).toBe(true);
                    }
                )
            );
        });

        it('should reject empty building names', () => {
            const result = createBuildingSchema.safeParse({ name: '' });
            expect(result.success).toBe(false);
        });

        it('should reject building names over 80 chars', () => {
            fc.assert(
                fc.property(
                    fc.string({ minLength: 81, maxLength: 200 }),
                    (name) => {
                        const result = createBuildingSchema.safeParse({ name });
                        expect(result.success).toBe(false);
                    }
                )
            );
        });
    });

    describe('Floor Validators', () => {
        it('should accept non-negative integer level numbers', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 0, max: 100 }),
                    (levelNumber) => {
                        const result = createFloorSchema.safeParse({ levelNumber });
                        expect(result.success).toBe(true);
                    }
                )
            );
        });

        it('should reject negative level numbers', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: -100, max: -1 }),
                    (levelNumber) => {
                        const result = createFloorSchema.safeParse({ levelNumber });
                        expect(result.success).toBe(false);
                    }
                )
            );
        });

        it('should reject non-integer level numbers', () => {
            fc.assert(
                fc.property(
                    fc.double({ min: 0.1, max: 100, noInteger: true }),
                    (levelNumber) => {
                        const result = createFloorSchema.safeParse({ levelNumber });
                        expect(result.success).toBe(false);
                    }
                )
            );
        });
    });

    describe('Room Validators', () => {
        it('should accept valid room names (1-80 chars)', () => {
            fc.assert(
                fc.property(
                    fc.string({ minLength: 1, maxLength: 80 }),
                    (name) => {
                        const result = createRoomSchema.safeParse({ name });
                        expect(result.success).toBe(true);
                    }
                )
            );
        });

        it('should accept room with optional code', () => {
            fc.assert(
                fc.property(
                    fc.string({ minLength: 1, maxLength: 80 }),
                    fc.option(fc.string({ minLength: 1, maxLength: 32 })),
                    (name, code) => {
                        const result = createRoomSchema.safeParse({
                            name,
                            code: code ?? undefined,
                        });
                        expect(result.success).toBe(true);
                    }
                )
            );
        });

        it('should reject room codes over 32 chars', () => {
            fc.assert(
                fc.property(
                    fc.string({ minLength: 1, maxLength: 80 }),
                    fc.string({ minLength: 33, maxLength: 100 }),
                    (name, code) => {
                        const result = createRoomSchema.safeParse({ name, code });
                        expect(result.success).toBe(false);
                    }
                )
            );
        });
    });
});

describe('User Query Validators Properties', () => {
    it('should accept valid pagination params', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 1, max: 1000 }),
                fc.integer({ min: 1, max: 100 }),
                (page, pageSize) => {
                    const result = userQuerySchema.safeParse({
                        page: page.toString(),
                        pageSize: pageSize.toString(),
                    });
                    expect(result.success).toBe(true);
                    if (result.success) {
                        expect(result.data.page).toBe(page);
                        expect(result.data.pageSize).toBe(pageSize);
                    }
                }
            )
        );
    });

    it('should accept optional search parameter', () => {
        fc.assert(
            fc.property(
                fc.option(fc.string()),
                (search) => {
                    const result = userQuerySchema.safeParse({
                        search: search ?? undefined,
                    });
                    expect(result.success).toBe(true);
                }
            )
        );
    });
});
