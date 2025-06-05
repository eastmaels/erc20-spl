"use client"

import { useState, useEffect } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TokenLauncher } from "@/components/token-launcher"
import { BridgeStatus } from "@/components/bridge-status"
import { WalletConnect } from "@/components/wallet-connect"
import { TokenHistory } from "@/components/token-history"
import { ethers } from "ethers"

const NEON_DEVNET = {
  chainId: '0xe9ac0ce', // 245022926 in hex
  chainName: 'Neon EVM DevNet',
  nativeCurrency: {
    name: 'NEON',
    symbol: 'NEON',
    decimals: 18
  },
  rpcUrls: ['https://devnet.neonevm.org'],
  blockExplorerUrls: ['https://devnet.neonscan.org']
}

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false)
  const [networkName, setNetworkName] = useState("")

  const checkAndSwitchNetwork = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask to use this dApp")
      return false
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const network = await provider.getNetwork()
      setNetworkName(network.name)
      
      // Check if the chain to connect to is already added
      const chainId = await window.ethereum.request({ method: 'eth_chainId' })
      console.log('chainId', chainId)
      console.log('NEON_DEVNET.chainId', NEON_DEVNET.chainId)
      console.log('chainId !== NEON_DEVNET.chainId', chainId !== NEON_DEVNET.chainId)
      
      if (chainId !== NEON_DEVNET.chainId) {
        try {
          // Try to switch to the Neon Devnet
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: NEON_DEVNET.chainId }],
          })
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [NEON_DEVNET],
              })
            } catch (addError) {
              console.error('Failed to add Neon Devnet:', addError)
              return false
            }
          } else {
            console.error('Failed to switch to Neon Devnet:', switchError)
            return false
          }
        }
      }
      setIsCorrectNetwork(true)
      return true
    } catch (error) {
      console.error('Failed to check/switch network:', error)
      return false
    }
  }

  useEffect(() => {
    const ethereum = window.ethereum
    if (typeof ethereum !== "undefined") {
      const handleChainChanged = async (chainId: string) => {
        console.log('handleChainChanged')
        if (chainId === NEON_DEVNET.chainId) {
          setIsCorrectNetwork(true)
          setNetworkName(NEON_DEVNET.chainName)
        } else {
          setIsCorrectNetwork(false)
          const provider = new ethers.BrowserProvider(ethereum)
          const network = await provider.getNetwork()
          setNetworkName(network.name)
          alert("Please connect to Neon Devnet to use this dApp")
        }
      }

      ethereum.on("chainChanged", handleChainChanged)

      // Initial network check if connected
      if (isConnected) {
        checkAndSwitchNetwork()
      }

      // Cleanup listeners on component unmount
      return () => {
        ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [isConnected])

  const handleConnect = async (connected: boolean) => {
    setIsConnected(connected)
    if (connected) {
      const isCorrectNetwork = await checkAndSwitchNetwork()
      setIsCorrectNetwork(isCorrectNetwork)
    } else {
      setIsCorrectNetwork(false)
      setNetworkName("")
    }
  }

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
              onConnect={handleConnect}
              onAddressChange={setWalletAddress}
              networkName={networkName}
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
                <TokenLauncher walletAddress={walletAddress} isCorrectNetwork={isCorrectNetwork} />
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
