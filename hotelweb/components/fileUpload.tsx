"use client"

import { useState } from "react"
import { UploadButton } from "@uploadthing/react"
import type { OurFileRouter } from "@/app/api/uploadthing/core"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X, ImageIcon } from 'lucide-react'
import toast from "react-hot-toast"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove: () => void
  label?: string
  required?: boolean
  className?: string
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  label = "Upload Image",
  required = false,
  className = "",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <Label className="text-sm font-medium text-slate-700 flex items-center space-x-1">
          <ImageIcon className="h-4 w-4" />
          <span>
            {label} {required && "*"}
          </span>
        </Label>
      )}

      {!value ? (
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50/50">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Upload className="h-8 w-8 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 mb-2">Upload Image</p>
              <UploadButton<OurFileRouter, "imageUploader">
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  console.log("Upload complete!", res)
                  if (res && res[0]) {
                    onChange(res[0].url)
                    toast.success("Upload thành công!")
                    setUploading(false)
                  }
                }}
                onUploadError={(error: Error) => {
                  console.error("Upload error:", error)
                  toast.error(`Lỗi khi upload: ${error.message}`)
                  setUploading(false)
                }}
                onUploadBegin={() => {
                  setUploading(true)
                  toast.loading("Đang upload ảnh...")
                }}
                appearance={{
                  button:
                    "bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors ut-ready:bg-primary ut-uploading:bg-primary/50",
                  allowedContent: "text-slate-500 text-xs mt-2",
                }}
              />
            </div>
            <p className="text-xs text-slate-500">PNG, JPG, GIF up to 4MB</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-white">
            <img
              src={value || "/placeholder.svg"}
              alt="Uploaded image preview"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onRemove}
                className="bg-white/90 hover:bg-white text-slate-900"
              >
                <X className="mr-2 h-4 w-4" />
                Remove Image
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-700 font-medium">Image uploaded successfully</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-green-700 hover:text-green-800 hover:bg-green-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {uploading && (
        <div className="flex items-center justify-center space-x-2 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-blue-700 font-medium">Đang upload ảnh...</span>
        </div>
      )}
    </div>
  )
}
