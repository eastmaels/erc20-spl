"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Copy } from "lucide-react"

interface TokenHistoryProps {
  walletAddress: string
}

interface LaunchedToken {
  id: string
  name: string
  symbol: string
  contractAddress: string
  totalSupply: string
  bridgeEnabled: boolean
  launchDate: Date
  status: "active" | "bridged" | "inactive"
}

export function TokenHistory({ walletAddress }: TokenHistoryProps) {
  const launchedTokens: LaunchedToken[] = [
    {
      id: "1",
      name: "My Token",
      symbol: "MTK",
      contractAddress: "0x1234567890123456789012345678901234567890",
      totalSupply: "1000000",
      bridgeEnabled: true,
      launchDate: new Date(Date.now() - 86400000),
      status: "bridged",
    },
    {
      id: "2",
      name: "Test Token",
      symbol: "TEST",
      contractAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
      totalSupply: "500000",
      bridgeEnabled: true,
      launchDate: new Date(Date.now() - 172800000),
      status: "active",
    },
    {
      id: "3",
      name: "Demo Token",
      symbol: "DEMO",
      contractAddress: "0x9876543210987654321098765432109876543210",
      totalSupply: "2000000",
      bridgeEnabled: false,
      launchDate: new Date(Date.now() - 259200000),
      status: "active",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "bridged":
        return "bg-blue-100 text-blue-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Launched Tokens</CardTitle>
          <CardDescription>Tokens you've launched using this dApp</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {launchedTokens.map((token) => (
              <Card key={token.id} className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-lg">
                        {token.name} ({token.symbol})
                      </h4>
                      <p className="text-sm text-gray-600">Launched {token.launchDate.toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {token.bridgeEnabled && <Badge variant="outline">SPL Bridge</Badge>}
                      <Badge className={getStatusColor(token.status)}>
                        {token.status.charAt(0).toUpperCase() + token.status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Contract Address</p>
                      <div className="flex items-center space-x-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1">
                          {token.contractAddress.slice(0, 10)}...{token.contractAddress.slice(-8)}
                        </code>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(token.contractAddress)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Total Supply</p>
                      <p className="text-sm">
                        {Number.parseInt(token.totalSupply).toLocaleString()} {token.symbol}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View on Explorer
                    </Button>
                    {token.bridgeEnabled && (
                      <Button variant="outline" size="sm">
                        Bridge to Solana
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Launch Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{launchedTokens.length}</div>
              <div className="text-sm text-purple-800">Total Launched</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {launchedTokens.filter((t) => t.status === "active").length}
              </div>
              <div className="text-sm text-green-800">Active Tokens</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {launchedTokens.filter((t) => t.bridgeEnabled).length}
              </div>
              <div className="text-sm text-blue-800">Bridge Enabled</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {launchedTokens.reduce((sum, t) => sum + Number.parseInt(t.totalSupply), 0).toLocaleString()}
              </div>
              <div className="text-sm text-orange-800">Total Supply</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
