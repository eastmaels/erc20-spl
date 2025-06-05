"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ExternalLink, RefreshCw } from "lucide-react"

interface BridgeTransaction {
  id: string
  tokenName: string
  tokenSymbol: string
  amount: string
  status: "pending" | "bridging" | "completed" | "failed"
  fromChain: string
  toChain: string
  txHash: string
  timestamp: Date
  progress: number
}

export function BridgeStatus() {
  const [transactions] = useState<BridgeTransaction[]>([
    {
      id: "1",
      tokenName: "My Token",
      tokenSymbol: "MTK",
      amount: "1000",
      status: "completed",
      fromChain: "Neon EVM",
      toChain: "Solana",
      txHash: "0x1234...5678",
      timestamp: new Date(Date.now() - 3600000),
      progress: 100,
    },
    {
      id: "2",
      tokenName: "Test Token",
      tokenSymbol: "TEST",
      amount: "500",
      status: "bridging",
      fromChain: "Neon EVM",
      toChain: "Solana",
      txHash: "0xabcd...efgh",
      timestamp: new Date(Date.now() - 1800000),
      progress: 65,
    },
    {
      id: "3",
      tokenName: "Demo Token",
      tokenSymbol: "DEMO",
      amount: "2000",
      status: "pending",
      fromChain: "Neon EVM",
      toChain: "Solana",
      txHash: "0x9876...5432",
      timestamp: new Date(Date.now() - 300000),
      progress: 25,
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "bridging":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Bridge Transactions</CardTitle>
              <CardDescription>Monitor your ERC20 to SPL token bridge transactions</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((tx) => (
              <Card key={tx.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h4 className="font-medium">
                          {tx.tokenName} ({tx.tokenSymbol})
                        </h4>
                        <p className="text-sm text-gray-600">
                          {tx.amount} tokens • {tx.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(tx.status)}>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="outline">{tx.fromChain}</Badge>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <Badge variant="outline">{tx.toChain}</Badge>
                  </div>

                  {tx.status === "bridging" && (
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span>Bridge Progress</span>
                        <span>{tx.progress}%</span>
                      </div>
                      <Progress value={tx.progress} className="h-2" />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{tx.txHash}</code>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bridge Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-sm text-green-800">Completed Bridges</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-sm text-blue-800">Active Bridges</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">45,000</div>
              <div className="text-sm text-purple-800">Total Volume</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
