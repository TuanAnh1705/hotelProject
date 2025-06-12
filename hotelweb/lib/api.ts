import axios from "axios"

// Create axios instance with environment-based config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ,
  timeout: 10000, // 10 second timeout
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }

    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`)
    return config
  },
  (error) => {
    console.error("Request error:", error)
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status)
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      console.error("Unauthorized access - redirecting to login")
      // Handle unauthorized - could redirect to login
    } else if (error.response?.status === 500) {
      console.error("Server error:", error.response.data)
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout")
    }

    return Promise.reject(error)
  },
)

export default api
