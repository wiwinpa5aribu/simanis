import { useEffect, useState } from 'react'

/**
 * Hook untuk menunda update value sampai delay tertentu (debounce)
 * Berguna untuk search input agar tidak spam request ke API/Store setiap keystroke
 *
 * @param value Nilai yang akan di-debounce
 * @param delay Delay dalam milidetik (default: 500ms)
 * @returns Nilai yang sudah di-debounce
 */
export function useDebouncedValue<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
