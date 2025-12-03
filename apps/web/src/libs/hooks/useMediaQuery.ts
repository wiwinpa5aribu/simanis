import { useEffect, useState } from 'react'

/**
 * Hook untuk mendeteksi media query (responsive breakpoints)
 *
 * @param query - CSS media query string, e.g. '(max-width: 1023px)'
 * @returns boolean - true jika media query match
 *
 * @example
 * // Check if mobile (< lg breakpoint)
 * const isMobile = useMediaQuery('(max-width: 1023px)')
 *
 * // Check if tablet or smaller
 * const isTablet = useMediaQuery('(max-width: 767px)')
 *
 * // Check for dark mode preference
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with the current match state (SSR-safe with fallback)
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches
    }
    return false
  })

  useEffect(() => {
    // Create media query list
    const mediaQueryList = window.matchMedia(query)

    // Update state when match changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Add listener (using modern API with fallback)
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange)
    } else {
      // Fallback for older browsers
      mediaQueryList.addListener(handleChange)
    }

    // Cleanup
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handleChange)
      } else {
        mediaQueryList.removeListener(handleChange)
      }
    }
  }, [query])

  return matches
}
