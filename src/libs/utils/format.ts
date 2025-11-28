/**
 * Format Utilities
 * Helper functions untuk formatting data
 */

/**
 * Format number sebagai currency IDR
 */
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value)
}

/**
 * Format number dengan thousand separator
 */
export function formatNumber(value: number): string {
    return new Intl.NumberFormat('id-ID').format(value)
}

/**
 * Format date ke format Indonesia
 */
export function formatDate(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'long',
    }).format(d)
}
