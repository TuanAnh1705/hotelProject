// Configuration file for environment variables
export const config = {
  // API Configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "/api",

  // Database Configuration
  databaseUrl: process.env.DATABASE_URL,

  // App Configuration
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",

  // Upload Configuration
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ["image/jpeg", "image/png", "image/webp"],

  // Pagination
  defaultPageSize: 10,
  maxPageSize: 100,
} as const

export type Config = typeof config
