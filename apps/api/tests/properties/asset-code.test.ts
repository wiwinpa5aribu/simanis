import * as fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import {
  AssetCodeGeneratorService,
  DEFAULT_CATEGORY_CODES,
  SCHOOL_PREFIX,
} from '../../src/infrastructure/services/asset-code-generator.service'
import { generateAssetQRCode } from '../../src/shared/utils/qr-code.utils'

/**
 * Property Tests for Asset Code Generation
 * Property 5: Asset Code Format Validation
 * Property 6: QR Code Round Trip
 */

describe('Asset Code Format Validation (Property 5)', () => {
  describe('AssetCodeGeneratorService.validateFormat', () => {
    it('should validate codes matching SCH/XX/YYY/NNN pattern', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 99 }),
          fc.constantFrom(...Object.values(DEFAULT_CATEGORY_CODES)),
          fc.integer({ min: 1, max: 999 }),
          (year, categoryCode, sequence) => {
            const yearStr = year.toString().padStart(2, '0')
            const seqStr = sequence.toString().padStart(3, '0')
            const code = `${SCHOOL_PREFIX}/${yearStr}/${categoryCode}/${seqStr}`

            const isValid = AssetCodeGeneratorService.validateFormat(code)
            expect(isValid).toBe(true)
          }
        )
      )
    })

    it('should reject codes with invalid prefix', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('ABC', 'XYZ', 'TST', 'AAA'),
          fc.integer({ min: 0, max: 99 }),
          fc.constantFrom(...Object.values(DEFAULT_CATEGORY_CODES)),
          fc.integer({ min: 1, max: 999 }),
          (prefix, year, categoryCode, sequence) => {
            const yearStr = year.toString().padStart(2, '0')
            const seqStr = sequence.toString().padStart(3, '0')
            const code = `${prefix}/${yearStr}/${categoryCode}/${seqStr}`

            expect(AssetCodeGeneratorService.validateFormat(code)).toBe(false)
          }
        )
      )
    })

    it('should reject codes with non-numeric year', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('AA', 'XX', 'YY', 'ZZ'),
          fc.constantFrom(...Object.values(DEFAULT_CATEGORY_CODES)),
          fc.integer({ min: 1, max: 999 }),
          (year, categoryCode, sequence) => {
            const seqStr = sequence.toString().padStart(3, '0')
            const code = `${SCHOOL_PREFIX}/${year}/${categoryCode}/${seqStr}`

            expect(AssetCodeGeneratorService.validateFormat(code)).toBe(false)
          }
        )
      )
    })

    it('should reject codes with invalid category code length', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 99 }),
          fc.constantFrom('AB', 'A', 'ABCD'),
          fc.integer({ min: 1, max: 999 }),
          (year, categoryCode, sequence) => {
            const yearStr = year.toString().padStart(2, '0')
            const seqStr = sequence.toString().padStart(3, '0')
            const code = `${SCHOOL_PREFIX}/${yearStr}/${categoryCode}/${seqStr}`

            expect(AssetCodeGeneratorService.validateFormat(code)).toBe(false)
          }
        )
      )
    })

    it('should reject codes with lowercase category', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 99 }),
          fc.constantFrom('abc', 'xyz', 'elk', 'frn', 'gen'),
          fc.integer({ min: 1, max: 999 }),
          (year, categoryCode, sequence) => {
            const yearStr = year.toString().padStart(2, '0')
            const seqStr = sequence.toString().padStart(3, '0')
            const code = `${SCHOOL_PREFIX}/${yearStr}/${categoryCode}/${seqStr}`

            expect(AssetCodeGeneratorService.validateFormat(code)).toBe(false)
          }
        )
      )
    })

    it('should reject codes with invalid sequence length', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 99 }),
          fc.constantFrom(...Object.values(DEFAULT_CATEGORY_CODES)),
          fc.integer({ min: 1000, max: 9999 }),
          (year, categoryCode, sequence) => {
            const yearStr = year.toString().padStart(2, '0')
            const code = `${SCHOOL_PREFIX}/${yearStr}/${categoryCode}/${sequence}`

            expect(AssetCodeGeneratorService.validateFormat(code)).toBe(false)
          }
        )
      )
    })
  })

  describe('AssetCodeGeneratorService.parseCode', () => {
    it('should correctly parse valid asset codes', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 99 }),
          fc.constantFrom(...Object.values(DEFAULT_CATEGORY_CODES)),
          fc.integer({ min: 1, max: 999 }),
          (year, categoryCode, sequence) => {
            const yearStr = year.toString().padStart(2, '0')
            const seqStr = sequence.toString().padStart(3, '0')
            const code = `${SCHOOL_PREFIX}/${yearStr}/${categoryCode}/${seqStr}`

            const parsed = AssetCodeGeneratorService.parseCode(code)
            expect(parsed).not.toBeNull()
            if (parsed) {
              expect(parsed.prefix).toBe(SCHOOL_PREFIX)
              expect(parsed.year).toBe(yearStr)
              expect(parsed.categoryCode).toBe(categoryCode)
              expect(parsed.sequence).toBe(sequence)
            }
          }
        )
      )
    })

    it('should return null for invalid codes', () => {
      const invalidCodes = [
        '',
        'invalid',
        'SCH/25/ELK',
        'SCH/25/ELK/1',
        'SCH/25/elk/001',
        'ABC/25/ELK/001',
      ]

      invalidCodes.forEach((code) => {
        const parsed = AssetCodeGeneratorService.parseCode(code)
        expect(parsed).toBeNull()
      })
    })
  })

  describe('Category code mapping', () => {
    it('should have 3-letter uppercase codes for all categories', () => {
      Object.entries(DEFAULT_CATEGORY_CODES).forEach(([_categoryId, code]) => {
        expect(code).toMatch(/^[A-Z]{3}$/)
      })
    })
  })
})

describe('QR Code Round Trip (Property 6)', () => {
  it(
    'should generate valid data URL for any valid asset code',
    async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 0, max: 99 }),
          fc.constantFrom(...Object.values(DEFAULT_CATEGORY_CODES)),
          fc.integer({ min: 1, max: 999 }),
          async (year, categoryCode, sequence) => {
            const yearStr = year.toString().padStart(2, '0')
            const seqStr = sequence.toString().padStart(3, '0')
            const code = `${SCHOOL_PREFIX}/${yearStr}/${categoryCode}/${seqStr}`

            const qrDataUrl = await generateAssetQRCode(code)

            // Should be a valid data URL
            expect(qrDataUrl).toMatch(/^data:image\/png;base64,/)

            // Should have base64 content
            const base64Part = qrDataUrl.split(',')[1]
            expect(base64Part.length).toBeGreaterThan(0)

            // Should be valid base64
            expect(() => Buffer.from(base64Part, 'base64')).not.toThrow()
          }
        ),
        { numRuns: 10 }
      )
    },
    15000
  )

  it('should generate consistent QR codes for same input', async () => {
    const testCode = 'SCH/25/ELK/001'

    const qr1 = await generateAssetQRCode(testCode)
    const qr2 = await generateAssetQRCode(testCode)

    expect(qr1).toBe(qr2)
  })

  it(
    'should generate different QR codes for different inputs',
    async () => {
      await fc.assert(
        fc.asyncProperty(fc.integer({ min: 1, max: 998 }), async (seq1) => {
          const code1 = `SCH/25/ELK/${seq1.toString().padStart(3, '0')}`
          const code2 = `SCH/25/ELK/${(seq1 + 1).toString().padStart(3, '0')}`

          const qr1 = await generateAssetQRCode(code1)
          const qr2 = await generateAssetQRCode(code2)

          expect(qr1).not.toBe(qr2)
        }),
        { numRuns: 5 }
      )
    },
    10000
  )

  it('should handle special characters in asset code gracefully', async () => {
    const specialCode = 'TEST/25/ABC/001'
    const qrDataUrl = await generateAssetQRCode(specialCode)

    expect(qrDataUrl).toMatch(/^data:image\/png;base64,/)
  })
})
