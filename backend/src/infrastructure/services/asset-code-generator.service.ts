/**
 * AssetCodeGenerator Service
 *
 * Generates unique asset codes with format: SCH/XX/YYY/NNN
 * - SCH: School prefix (configurable)
 * - XX: 2-digit year (e.g., 25 for 2025)
 * - YYY: 3-letter category code
 * - NNN: 3-digit sequential number per category per year
 *
 * Example: SCH/25/ELK/001
 */

import { PrismaClient } from '@prisma/client'

export interface CategoryCodeMapping {
  categoryId: number
  code: string
}

// Default category code mappings
const DEFAULT_CATEGORY_CODES: Record<number, string> = {
  1: 'ELK', // Elektronik
  2: 'FRN', // Furniture
  3: 'KND', // Kendaraan
  4: 'OLR', // Alat Olahraga
  5: 'BKU', // Buku
  6: 'ATK', // Alat Tulis Kantor
  7: 'LAB', // Peralatan Lab
  8: 'MUS', // Alat Musik
  9: 'OPT', // Peralatan Optik
  10: 'MED', // Peralatan Medis
}

const DEFAULT_CATEGORY_CODE = 'GEN' // General/Umum
const SCHOOL_PREFIX = 'SCH'

export class AssetCodeGeneratorService {
  private prisma: PrismaClient
  private categoryCodeMap: Record<number, string>

  constructor(
    prisma: PrismaClient,
    customCategoryMap?: Record<number, string>
  ) {
    this.prisma = prisma
    this.categoryCodeMap = customCategoryMap || DEFAULT_CATEGORY_CODES
  }

  /**
   * Generate a new unique asset code
   * Format: SCH/XX/YYY/NNN
   */
  async generateCode(categoryId?: number): Promise<string> {
    const year = this.getYearCode()
    const categoryCode = this.getCategoryCode(categoryId)
    const sequenceNumber = await this.getNextSequenceNumber(year, categoryCode)

    return this.formatAssetCode(year, categoryCode, sequenceNumber)
  }

  /**
   * Get 2-digit year code (e.g., "25" for 2025)
   */
  private getYearCode(): string {
    return new Date().getFullYear().toString().slice(-2)
  }

  /**
   * Get 3-letter category code from categoryId
   */
  private getCategoryCode(categoryId?: number): string {
    if (!categoryId) {
      return DEFAULT_CATEGORY_CODE
    }
    return this.categoryCodeMap[categoryId] || DEFAULT_CATEGORY_CODE
  }

  /**
   * Get next sequence number for the given year and category
   */
  private async getNextSequenceNumber(
    year: string,
    categoryCode: string
  ): Promise<number> {
    const pattern = `${SCHOOL_PREFIX}/${year}/${categoryCode}/%`

    // Find the last asset with matching pattern
    const lastAsset = await this.prisma.asset.findFirst({
      where: {
        kodeAset: {
          startsWith: `${SCHOOL_PREFIX}/${year}/${categoryCode}/`,
        },
      },
      orderBy: {
        kodeAset: 'desc',
      },
      select: {
        kodeAset: true,
      },
    })

    if (!lastAsset) {
      return 1
    }

    // Extract sequence number from last asset code
    const parts = lastAsset.kodeAset.split('/')
    if (parts.length !== 4) {
      return 1
    }

    const lastSequence = parseInt(parts[3], 10)
    if (isNaN(lastSequence)) {
      return 1
    }

    return lastSequence + 1
  }

  /**
   * Format asset code with proper padding
   */
  private formatAssetCode(
    year: string,
    categoryCode: string,
    sequenceNumber: number
  ): string {
    const paddedSequence = sequenceNumber.toString().padStart(3, '0')
    return `${SCHOOL_PREFIX}/${year}/${categoryCode}/${paddedSequence}`
  }

  /**
   * Validate asset code format
   * Returns true if code matches SCH/XX/YYY/NNN pattern
   */
  static validateFormat(kodeAset: string): boolean {
    const pattern = /^SCH\/\d{2}\/[A-Z]{3}\/\d{3}$/
    return pattern.test(kodeAset)
  }

  /**
   * Parse asset code into components
   */
  static parseCode(kodeAset: string): {
    prefix: string
    year: string
    categoryCode: string
    sequence: number
  } | null {
    if (!this.validateFormat(kodeAset)) {
      return null
    }

    const parts = kodeAset.split('/')
    return {
      prefix: parts[0],
      year: parts[1],
      categoryCode: parts[2],
      sequence: parseInt(parts[3], 10),
    }
  }

  /**
   * Get category code for a given category ID
   */
  getCategoryCodeById(categoryId: number): string {
    return this.categoryCodeMap[categoryId] || DEFAULT_CATEGORY_CODE
  }

  /**
   * Update category code mapping
   */
  setCategoryCode(categoryId: number, code: string): void {
    if (code.length !== 3 || !/^[A-Z]{3}$/.test(code)) {
      throw new Error('Category code must be exactly 3 uppercase letters')
    }
    this.categoryCodeMap[categoryId] = code
  }
}

// Export constants for testing
export { DEFAULT_CATEGORY_CODES, DEFAULT_CATEGORY_CODE, SCHOOL_PREFIX }
