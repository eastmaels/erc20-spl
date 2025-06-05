"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, ExternalLink } from "lucide-react"

interface WalletConnectProps {
  isConnected: boolean
  walletAddress: string
  onConnect: (connected: boolean) => void
  onAddressChange: (address: string) => void
  networkName: string
}

export function WalletConnect({ isConnected, walletAddress, onConnect, onAddressChange, networkName }: WalletConnectProps) {
  const [isLoading, setIsLoading] = useState(false)

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask to use this dApp")
      return
    }

    setIsLoading(true)
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length > 0) {
        onAddressChange(accounts[0])
        onConnect(true)
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    onConnect(false)
    onAddressChange("")
  }

  if (isConnected) {
    return (
      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Wallet className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium">Connected</p>
              <p className="text-sm text-gray-600">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {networkName || "Neon EVM"}
            </Badge>
            <Button variant="outline" size="sm" onClick={disconnectWallet}>
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <Wallet className="h-5 w-5" />
          <span>Connect Wallet</span>
        </CardTitle>
        <CardDescription>Connect to Neon EVM to start launching tokens</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={connectWallet} disabled={isLoading} className="w-full" size="lg">
          {isLoading ? "Connecting..." : "Connect MetaMask"}
        </Button>
        <div className="text-center">
          <a
            href="https://neonevm.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline inline-flex items-center space-x-1"
          >
            <span>Learn about Neon EVM</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
