import { toast } from 'sonner'

export function showSuccessToast(message: string) {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
  })
}

export function showErrorToast(message: string) {
  toast.error(message, {
    duration: 5000,
    position: 'top-right',
  })
}

export function showWarningToast(message: string) {
  toast.warning(message, {
    duration: 4000,
    position: 'top-right',
  })
}

export function showInfoToast(message: string) {
  toast.info(message, {
    duration: 3000,
    position: 'top-right',
  })
}
