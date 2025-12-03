import { describe, expect, it } from 'vitest'
import {
  generateAssetQRCode,
  generateAssetQRCodeBuffer,
  parseAssetCode,
  validateAssetCode,
} from './qr-code.utils'

describe('QR Code Utils', () => {
  describe('generateAssetQRCode', () => {
    it('should generate valid data URL for asset code', async () => {
      // Arrange
      const kodeAset = 'SCH/24/ELK/001'

      // Act
      const result = await generateAssetQRCode(kodeAset)

      // Assert
      expect(result).toMatch(/^data:image\/png;base64,/)
      expect(result.split(',')[1].length).toBeGreaterThan(0)
    })

    it('should generate different QR codes for different inputs', async () => {
      // Arrange
      const code1 = 'SCH/24/ELK/001'
      const code2 = 'SCH/24/ELK/002'

      // Act
      const qr1 = await generateAssetQRCode(code1)
      const qr2 = await generateAssetQRCode(code2)

      // Assert
      expect(qr1).not.toBe(qr2)
    })

    it('should generate consistent QR codes for same input', async () => {
      // Arrange
      const kodeAset = 'SCH/24/ELK/001'

      // Act
      const qr1 = await generateAssetQRCode(kodeAset)
      const qr2 = await generateAssetQRCode(kodeAset)

      // Assert
      expect(qr1).toBe(qr2)
    })

    it('should handle special characters', async () => {
      // Arrange
      const kodeAset = 'SCH/24/ELK/001-Special'

      // Act
      const result = await generateAssetQRCode(kodeAset)

      // Assert
      expect(result).toMatch(/^data:image\/png;base64,/)
    })
  })

  describe('generateAssetQRCodeBuffer', () => {
    it('should generate valid PNG buffer', async () => {
      // Arrange
      const kodeAset = 'SCH/24/ELK/001'

      // Act
      const result = await generateAssetQRCodeBuffer(kodeAset)

      // Assert
      expect(Buffer.isBuffer(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      // Check PNG signature
      expect(result[0]).toBe(0x89)
      expect(result[1]).toBe(0x50)
      expect(result[2]).toBe(0x4e)
      expect(result[3]).toBe(0x47)
    })

    it('should generate different buffers for different codes', async () => {
      // Arrange
      const code1 = 'SCH/24/ELK/001'
      const code2 = 'SCH/24/FUR/001'

      // Act
      const buffer1 = await generateAssetQRCodeBuffer(code1)
      const buffer2 = await generateAssetQRCodeBuffer(code2)

      // Assert
      expect(buffer1.equals(buffer2)).toBe(false)
    })

    it('should generate consistent buffers for same code', async () => {
      // Arrange
      const kodeAset = 'SCH/24/ELK/001'

      // Act
      const buffer1 = await generateAssetQRCodeBuffer(kodeAset)
      const buffer2 = await generateAssetQRCodeBuffer(kodeAset)

      // Assert
      expect(buffer1.equals(buffer2)).toBe(true)
    })
  })

  describe('validateAssetCode', () => {
    it('should validate correct asset code format', () => {
      // Valid formats
      expect(validateAssetCode('SCH/24/ELK/001')).toBe(true)
      expect(validateAssetCode('SCH/23/FUR/999')).toBe(true)
      expect(validateAssetCode('SCH/00/ABC/000')).toBe(true)
      expect(validateAssetCode('SCH/99/XYZ/123')).toBe(true)
    })

    it('should reject invalid formats', () => {
      // Missing parts
      expect(validateAssetCode('SCH/24/ELK')).toBe(false)
      expect(validateAssetCode('SCH/24')).toBe(false)
      expect(validateAssetCode('SCH')).toBe(false)

      // Wrong separators
      expect(validateAssetCode('SCH-24-ELK-001')).toBe(false)
      expect(validateAssetCode('SCH_24_ELK_001')).toBe(false)

      // Wrong lengths
      expect(validateAssetCode('SCH/2024/ELK/001')).toBe(false) // 4-digit year
      expect(validateAssetCode('SCH/24/ELEC/001')).toBe(false) // 4-letter category
      expect(validateAssetCode('SCH/24/EL/001')).toBe(false) // 2-letter category
      expect(validateAssetCode('SCH/24/ELK/1')).toBe(false) // 1-digit sequence
      expect(validateAssetCode('SCH/24/ELK/1234')).toBe(false) // 4-digit sequence

      // Wrong prefix
      expect(validateAssetCode('ABC/24/ELK/001')).toBe(false)
      expect(validateAssetCode('SCHOOL/24/ELK/001')).toBe(false)

      // Lowercase category
      expect(validateAssetCode('SCH/24/elk/001')).toBe(false)

      // Empty or invalid
      expect(validateAssetCode('')).toBe(false)
      expect(validateAssetCode('invalid')).toBe(false)
    })

    it('should handle edge cases', () => {
      // With extra characters
      expect(validateAssetCode('SCH/24/ELK/001 ')).toBe(false)
      expect(validateAssetCode(' SCH/24/ELK/001')).toBe(false)

      // Special characters
      expect(validateAssetCode('SCH/24/EL-K/001')).toBe(false)
      expect(validateAssetCode('SCH/24/ELK/00.1')).toBe(false)
    })
  })

  describe('parseAssetCode', () => {
    it('should parse valid asset code', () => {
      // Arrange
      const kodeAset = 'SCH/24/ELK/001'

      // Act
      const result = parseAssetCode(kodeAset)

      // Assert
      expect(result).toEqual({
        prefix: 'SCH',
        year: '24',
        categoryCode: 'ELK',
        sequence: 1,
      })
    })

    it('should parse different asset codes', () => {
      const testCases = [
        {
          code: 'SCH/23/FUR/999',
          expected: {
            prefix: 'SCH',
            year: '23',
            categoryCode: 'FUR',
            sequence: 999,
          },
        },
        {
          code: 'SCH/00/ABC/000',
          expected: {
            prefix: 'SCH',
            year: '00',
            categoryCode: 'ABC',
            sequence: 0,
          },
        },
        {
          code: 'SCH/99/XYZ/123',
          expected: {
            prefix: 'SCH',
            year: '99',
            categoryCode: 'XYZ',
            sequence: 123,
          },
        },
      ]

      for (const testCase of testCases) {
        const result = parseAssetCode(testCase.code)
        expect(result).toEqual(testCase.expected)
      }
    })

    it('should return null for invalid codes', () => {
      expect(parseAssetCode('SCH/24/ELK')).toBeNull()
      expect(parseAssetCode('invalid')).toBeNull()
      expect(parseAssetCode('')).toBeNull()
      expect(parseAssetCode('SCH-24-ELK-001')).toBeNull()
      expect(parseAssetCode('SCH/24/elk/001')).toBeNull()
    })

    it('should convert sequence to number', () => {
      // Arrange
      const codes = [
        { code: 'SCH/24/ELK/001', expectedSeq: 1 },
        { code: 'SCH/24/ELK/010', expectedSeq: 10 },
        { code: 'SCH/24/ELK/100', expectedSeq: 100 },
      ]

      for (const testCase of codes) {
        // Act
        const result = parseAssetCode(testCase.code)

        // Assert
        expect(result?.sequence).toBe(testCase.expectedSeq)
        expect(typeof result?.sequence).toBe('number')
      }
    })
  })
})
