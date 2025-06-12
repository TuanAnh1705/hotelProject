/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextRequest } from "next/server"
import { ZodError } from "zod"

// API Response helper
export function createApiResponse<T>(data: T, status = 200) {
  return Response.json(data, { status })
}

// API Error response helper
export function createApiError(message: string, status = 500, details?: any) {
  return Response.json(
    {
      error: message,
      details: details || null,
      timestamp: new Date().toISOString(),
    },
    { status },
  )
}

// Handle API errors
export function handleApiError(error: unknown) {
  console.error("API Error:", error)

  if (error instanceof ZodError) {
    return createApiError("Validation error", 400, error.errors)
  }

  if (error instanceof Error) {
    return createApiError(error.message, 500)
  }

  return createApiError("Internal server error", 500)
}

// Async handler wrapper
export function asyncHandler(handler: (req: NextRequest, context?: any) => Promise<Response>) {
  return async (req: NextRequest, context?: any) => {
    try {
      return await handler(req, context)
    } catch (error) {
      return handleApiError(error)
    }
  }
}

// Method validator
export function validateMethod(req: NextRequest, allowedMethods: string[]) {
  if (!allowedMethods.includes(req.method)) {
    throw new Error(`Method ${req.method} not allowed`)
  }
}
