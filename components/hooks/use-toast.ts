"use client"

import * as React from "react"
import { create } from "zustand"

export type Toast = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  duration?: number
}

type ToastStore = {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: Math.random().toString(36).substring(2, 9) },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))

export function useToast() {
  const { toasts, addToast, removeToast } = useToastStore()

  const toast = React.useCallback(
    (toast: Omit<Toast, "id">) => {
      addToast(toast)
      setTimeout(() => {
        removeToast(toasts[toasts.length - 1]?.id || "")
      }, toast.duration || 4000)
    },
    [addToast, removeToast, toasts]
  )

  return { toast, toasts }
}
