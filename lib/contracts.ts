export const NEON_EVM_CONFIG = {
  chainId: 245022934, // Neon EVM Mainnet
  rpcUrl: "https://neon-proxy-mainnet.solana.p2p.org",
  explorerUrl: "https://neonscan.org",
}

export const CONTRACT_ADDRESSES = {
  TOKEN_FACTORY: "0x1234567890123456789012345678901234567890",
  BRIDGE_CONTROLLER: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
  COMPOSABILITY_HANDLER: "0x9876543210987654321098765432109876543210",
}

export const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
]

export const TOKEN_FACTORY_ABI = [
  "function createToken(string name, string symbol, uint256 totalSupply, uint8 decimals, bool enableBridge) returns (address)",
  "function getTokensByOwner(address owner) view returns (address[])",
  "event TokenCreated(address indexed token, address indexed owner, string name, string symbol)",
]

export const BRIDGE_ABI = [
  "function initiateBridge(address token, uint256 amount, string solanaAddress) returns (bytes32)",
  "function getBridgeStatus(bytes32 bridgeId) view returns (uint8)",
  "event BridgeInitiated(bytes32 indexed bridgeId, address indexed token, uint256 amount)",
]
