"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"
import api from "@/lib/api"

interface ApiStatus {
  status: "online" | "offline" | "checking"
  responseTime?: number
  lastChecked?: Date
}

export function ApiStatus() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>({ status: "checking" })

  const checkApiStatus = async () => {
    setApiStatus({ status: "checking" })
    const startTime = Date.now()

    try {
      await api.get("/health")
      const responseTime = Date.now() - startTime
      setApiStatus({
        status: "online",
        responseTime,
        lastChecked: new Date(),
      })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setApiStatus({
        status: "offline",
        lastChecked: new Date(),
      })
    }
  }

  useEffect(() => {
    checkApiStatus()
    // Check every 30 seconds
    const interval = setInterval(checkApiStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    switch (apiStatus.status) {
      case "online":
        return "bg-green-500"
      case "offline":
        return "bg-red-500"
      default:
        return "bg-yellow-500"
    }
  }

  const getStatusIcon = () => {
    switch (apiStatus.status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "offline":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <RefreshCw className="h-4 w-4 text-yellow-600 animate-spin" />
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">API Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="text-sm font-medium capitalize">{apiStatus.status}</span>
          </div>
          <Badge variant="outline" className={`${getStatusColor()} text-white border-0`}>
            {apiStatus.status}
          </Badge>
        </div>

        {apiStatus.responseTime && (
          <div className="text-xs text-muted-foreground">Response time: {apiStatus.responseTime}ms</div>
        )}

        {apiStatus.lastChecked && (
          <div className="text-xs text-muted-foreground">
            Last checked: {apiStatus.lastChecked.toLocaleTimeString()}
          </div>
        )}

        <Button variant="outline" size="sm" onClick={checkApiStatus} className="w-full">
          <RefreshCw className="mr-2 h-3 w-3" />
          Check Status
        </Button>
      </CardContent>
    </Card>
  )
}
