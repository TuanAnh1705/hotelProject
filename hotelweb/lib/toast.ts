import toast, { Renderable, type ToastOptions as HotToastOptions } from "react-hot-toast"

interface ToastMessages {
  loading: string
  success: string
  error: string
}

export const showToast = {
  success: (message: string, options?: HotToastOptions) => {
    return toast.success(message, options)
  },
  
  error: (message: string, options?: HotToastOptions) => {
    return toast.error(message, options)
  },
  
  loading: (message: string, options?: HotToastOptions) => {
    return toast.loading(message, options)
  },
  
  dismiss: (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId)
    } else {
      toast.dismiss()
    }
  },

  promise: <T>(
    promise: Promise<T>,
    messages: ToastMessages,
    options?: HotToastOptions
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      options
    )
  },
  
  custom: (message: Renderable, options?: HotToastOptions) => {
    return toast(message, options)
  },
}

// Export types for use in other files
export type { HotToastOptions as ToastOptions, ToastMessages }
