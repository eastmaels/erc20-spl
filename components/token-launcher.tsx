"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Rocket, ArrowRight, CheckCircle, AlertCircle } from "lucide-react"
import { ethers } from "ethers"
import { ERC20_TO_SPL_ABI } from "@/constants/abi"
import { CONTRACT_ADDRESSES } from "@/constants/contracts"

interface TokenLauncherProps {
  walletAddress: string
  isCorrectNetwork: boolean
}

interface TokenData {
  name: string
  symbol: string
  totalSupply: string
  decimals: string
  description: string
  enableBridge: boolean
}

export function TokenLauncher({ walletAddress, isCorrectNetwork }: TokenLauncherProps) {
  const [tokenData, setTokenData] = useState<TokenData>({
    name: "",
    symbol: "",
    totalSupply: "",
    decimals: "18",
    description: "",
    enableBridge: true,
  })

  const [isLaunching, setIsLaunching] = useState(false)
  const [launchProgress, setLaunchProgress] = useState(0)
  const [launchStep, setLaunchStep] = useState("")
  const [txHash, setTxHash] = useState("")

  const handleInputChange = (field: keyof TokenData, value: string | boolean) => {
    setTokenData((prev) => ({ ...prev, [field]: value }))
  }

  const launchToken = async () => {
    setIsLaunching(true)
    setLaunchProgress(0)

    try {
      // Step 1: Connect to provider and get signer
      setLaunchStep("Connecting to wallet...")
      setLaunchProgress(25)
      
      if (!window.ethereum) {
        throw new Error("Please install MetaMask or another Ethereum wallet")
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      
      // Step 2: Deploy ERC20 Contract
      setLaunchStep("Deploying ERC20 contract...")
      setLaunchProgress(50)

      // Add logging to debug contract instantiation
      console.log('Factory contract address:', CONTRACT_ADDRESSES.erc20ToSpl)
      console.log('Contract ABI:', ERC20_TO_SPL_ABI)
      
      const factory = new ethers.Contract(CONTRACT_ADDRESSES.erc20ToSpl, ERC20_TO_SPL_ABI, signer)
      
      // Log available functions
      // console.log('Available functions:', Object.keys(factory.functions))
      console.log('tokenData', tokenData)

      const tx = await factory.createErc20ForSplMintable(
        tokenData.name,
        tokenData.symbol,
        parseInt(tokenData.decimals),
        walletAddress // Using the connected wallet as mint authority
      )

      // Step 3: Wait for transaction
      setLaunchStep("Waiting for transaction confirmation...")
      setLaunchProgress(75)
      const receipt = await tx.wait()

      // Step 4: Complete
      setLaunchStep("Token launched successfully!")
      setLaunchProgress(100)
      setTxHash(receipt.hash)
    } catch (error: any) {
      console.error("Launch failed:", error)
      setLaunchStep(`Launch failed: ${error?.message || 'Unknown error'}`)
    } finally {
      setTimeout(() => {
        setIsLaunching(false)
        setLaunchProgress(0)
        setLaunchStep("")
      }, 3000)
    }
  }

  const isFormValid = tokenData.name && tokenData.symbol && tokenData.totalSupply

  if (isLaunching) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Rocket className="h-5 w-5 animate-pulse" />
            <span>Launching Token</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{launchStep}</span>
              <span>{launchProgress}%</span>
            </div>
            <Progress value={launchProgress} className="h-2" />
          </div>

          {txHash && (
            <div className="text-center space-y-2">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
              <p className="font-medium text-green-800">Token Launched Successfully!</p>
              <p className="text-sm text-gray-600">Transaction Hash:</p>
              <code className="text-xs bg-gray-100 p-2 rounded block break-all">{txHash}</code>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Token Configuration</CardTitle>
          <CardDescription>Configure your ERC20 token parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Token Name</Label>
              <Input
                id="name"
                placeholder="My Token"
                value={tokenData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                placeholder="MTK"
                value={tokenData.symbol}
                onChange={(e) => handleInputChange("symbol", e.target.value.toUpperCase())}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supply">Total Supply</Label>
              <Input
                id="supply"
                type="number"
                placeholder="1000000"
                value={tokenData.totalSupply}
                onChange={(e) => handleInputChange("totalSupply", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="decimals">Decimals</Label>
              <Input
                id="decimals"
                type="number"
                value={tokenData.decimals}
                onChange={(e) => handleInputChange("decimals", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe your token..."
              value={tokenData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="bridge"
              checked={tokenData.enableBridge}
              onCheckedChange={(checked) => handleInputChange("enableBridge", checked)}
            />
            <Label htmlFor="bridge">Enable SPL Bridge</Label>
            <Badge variant="secondary">Recommended</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Launch Preview</CardTitle>
          <CardDescription>Review your token configuration before launching</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Token Name:</span>
              <span className="text-sm">{tokenData.name || "Not set"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Symbol:</span>
              <span className="text-sm">{tokenData.symbol || "Not set"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Total Supply:</span>
              <span className="text-sm">{tokenData.totalSupply || "0"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Decimals:</span>
              <span className="text-sm">{tokenData.decimals}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">SPL Bridge:</span>
              <Badge variant={tokenData.enableBridge ? "default" : "secondary"}>
                {tokenData.enableBridge ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="space-y-2">
              <h4 className="font-medium">Deployment Steps:</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Deploy ERC20 contract on Neon EVM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Initialize composability features</span>
                </div>
                {tokenData.enableBridge && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Setup SPL token bridge</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button 
            onClick={launchToken} 
            disabled={!isFormValid || !isCorrectNetwork} 
            className="w-full" 
            size="lg"
          >
            <Rocket className="h-4 w-4 mr-2" />
            Launch Token
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>

          {!isFormValid && (
            <div className="flex items-center space-x-2 text-sm text-amber-600">
              <AlertCircle className="h-4 w-4" />
              <span>Please fill in all required fields</span>
            </div>
          )}

          {!isCorrectNetwork && (
            <div className="flex items-center space-x-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>Please connect to Neon Devnet to launch tokens</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
