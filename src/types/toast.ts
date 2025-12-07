export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
}

export interface ToastProps extends Toast {
  onClose: () => void
}

export interface ToastContainerProps {
  toasts: Toast[]
  removeToast: (id: string) => void
}