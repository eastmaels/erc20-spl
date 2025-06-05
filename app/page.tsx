"use client"

import { useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TokenLauncher } from "@/components/token-launcher"
import { BridgeStatus } from "@/components/bridge-status"
import { WalletConnect } from "@/components/wallet-connect"
import { TokenHistory } from "@/components/token-history"

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            ERC20 to SPL Token Launcher
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Launch and bridge ERC20 tokens to Solana SPL tokens using Neon EVM's composability features
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <WalletConnect
              isConnected={isConnected}
              walletAddress={walletAddress}
              onConnect={setIsConnected}
              onAddressChange={setWalletAddress}
            />
          </div>

          {isConnected ? (
            <Tabs defaultValue="launcher" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="launcher">Token Launcher</TabsTrigger>
                <TabsTrigger value="bridge">Bridge Status</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="launcher">
                <TokenLauncher walletAddress={walletAddress} />
              </TabsContent>

              <TabsContent value="bridge">
                <BridgeStatus />
              </TabsContent>

              <TabsContent value="history">
                <TokenHistory walletAddress={walletAddress} />
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="max-w-md mx-auto">
              <CardHeader className="text-center">
                <CardTitle>Connect Your Wallet</CardTitle>
                <CardDescription>Please connect your wallet to start launching tokens</CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
