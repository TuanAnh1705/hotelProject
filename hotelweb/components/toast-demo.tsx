"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { showToast } from "@/lib/toast"
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react"

export function ToastDemo() {
  const handleSuccessToast = () => {
    showToast.success("This is a success message!")
  }

  const handleErrorToast = () => {
    showToast.error("This is an error message!")
  }

  const handleLoadingToast = () => {
    const toastId = showToast.loading("Loading...")

    setTimeout(() => {
      showToast.dismiss(toastId)
      showToast.success("Loaded successfully!")
    }, 2000)
  }

  const handlePromiseToast = () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.3) {
          resolve("Data loaded successfully")
        } else {
          reject(new Error("Failed to load data"))
        }
      }, 2000)
    })

    showToast.promise(promise, {
      loading: "Loading data...",
      success: "Data loaded successfully!",
      error: "Failed to load data",
    })
  }

  const handleCustomToast = () => {
    showToast.custom(
      <div className="flex items-center gap-2">
        <Info className="h-4 w-4 text-blue-500" />
        <span>Custom toast with icon</span>
      </div>,
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Toast Notifications</CardTitle>
        <CardDescription>Test different types of toast notifications</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Button onClick={handleSuccessToast} className="bg-green-600 hover:bg-green-700">
          <CheckCircle className="mr-2 h-4 w-4" />
          Success
        </Button>
        <Button onClick={handleErrorToast} className="bg-red-600 hover:bg-red-700">
          <XCircle className="mr-2 h-4 w-4" />
          Error
        </Button>
        <Button onClick={handleLoadingToast} className="bg-yellow-600 hover:bg-yellow-700">
          <AlertCircle className="mr-2 h-4 w-4" />
          Loading
        </Button>
        <Button onClick={handlePromiseToast} className="bg-blue-600 hover:bg-blue-700">
          <Info className="mr-2 h-4 w-4" />
          Promise
        </Button>
        <Button onClick={handleCustomToast} variant="outline">
          Custom
        </Button>
      </CardContent>
    </Card>
  )
}
