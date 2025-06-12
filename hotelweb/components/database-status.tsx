"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Database, RefreshCw, CheckCircle, XCircle } from "lucide-react"
import api from "@/lib/api"

interface DatabaseStats {
  hotels: number
  rooms: number
}

interface DatabaseStatus {
  status: "connected" | "disconnected" | "checking"
  stats?: DatabaseStats
  lastChecked?: Date
  error?: string
}

export function DatabaseStatus() {
  const [dbStatus, setDbStatus] = useState<DatabaseStatus>({ status: "checking" })

  const checkDatabaseStatus = async () => {
    setDbStatus({ status: "checking" })

    try {
      const response = await api.get("/test-db")
      const data = response.data

      if (data.status === "success") {
        setDbStatus({
          status: "connected",
          stats: data.data.stats,
          lastChecked: new Date(),
        })
      } else {
        setDbStatus({
          status: "disconnected",
          error: data.error,
          lastChecked: new Date(),
        })
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setDbStatus({
        status: "disconnected",
        error: error.response?.data?.error || error.message,
        lastChecked: new Date(),
      })
    }
  }

  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  const getStatusColor = () => {
    switch (dbStatus.status) {
      case "connected":
        return "bg-green-500"
      case "disconnected":
        return "bg-red-500"
      default:
        return "bg-yellow-500"
    }
  }

  const getStatusIcon = () => {
    switch (dbStatus.status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "disconnected":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <RefreshCw className="h-4 w-4 text-yellow-600 animate-spin" />
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center">
          <Database className="mr-2 h-4 w-4" />
          Database Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="text-sm font-medium capitalize">{dbStatus.status}</span>
          </div>
          <Badge variant="outline" className={`${getStatusColor()} text-white border-0`}>
            {dbStatus.status}
          </Badge>
        </div>

        {dbStatus.stats && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-blue-50 p-2 rounded">
              <div className="font-medium text-blue-900">Hotels</div>
              <div className="text-blue-700">{dbStatus.stats.hotels}</div>
            </div>
            <div className="bg-green-50 p-2 rounded">
              <div className="font-medium text-green-900">Rooms</div>
              <div className="text-green-700">{dbStatus.stats.rooms}</div>
            </div>
          </div>
        )}

        {dbStatus.error && <div className="text-xs text-red-600 bg-red-50 p-2 rounded">Error: {dbStatus.error}</div>}

        {dbStatus.lastChecked && (
          <div className="text-xs text-muted-foreground">Last checked: {dbStatus.lastChecked.toLocaleTimeString()}</div>
        )}

        <Button variant="outline" size="sm" onClick={checkDatabaseStatus} className="w-full">
          <RefreshCw className="mr-2 h-3 w-3" />
          Test Connection
        </Button>
      </CardContent>
    </Card>
  )
}
