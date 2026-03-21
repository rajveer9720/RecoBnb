import {
  bscTestnet,
  bsc,
  polygonAmoy,
  polygon,
  avalanche,
  avalancheFuji,
  sonic,
} from "wagmi/chains";
import { formatUnits } from "ethers";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  walletConnectWallet,
  coinbaseWallet,
  trustWallet,
  binanceWallet,
  rainbowWallet,
  phantomWallet,
  rabbyWallet,
  ledgerWallet,
  okxWallet,
  braveWallet,
  argentWallet,
  uniswapWallet,
  safepalWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { defineChain } from 'viem';

const sonicTestnetChain = defineChain({
  id: 14601,
  name: 'Sonic Testnet',
  nativeCurrency: { name: 'Sonic', symbol: 'S', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.soniclabs.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'SonicScan',
      url: 'https://testnet.sonicscan.org',
    },
  },
  testnet: true,
});

export const getNetwork = () => {
  const chainId = import.meta.env.VITE_APP_APPKIT_CHAIN_ID || "bsc";
  switch (chainId) {
    case "bsc":
      return bsc;
    case "bscTestnet":
      return bscTestnet;
    case "polygon":
      return polygon;
    case "polygonAmoy":
      return polygonAmoy;
    case "avax":
      return avalanche;
    case "avaxFuji":
      return avalancheFuji;
    case "sonic":
      return sonic; 
    case "sonicTestnet":
      return sonicTestnetChain;
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`);
  }
};

export const getWalletSymbol = () => {
  const chainId = import.meta.env.VITE_APP_APPKIT_CHAIN_ID || "bsc";
  const chainIdMap: Record<string, string> = {
    bsc: "BNB",
    bscTestnet: "BNB",
    polygon: "POL",
    polygonAmoy: "POL",
    avax: "AVAX",
    avaxFuji: "AVAX",
    sonic: "S",
    sonicTestnet: "S",
  };
  if (chainId in chainIdMap) {
    return chainIdMap[chainId];
  }
  throw new Error(`Unsupported chain ID: ${chainId}`);
};

export const getWalletChainId = () => {
  const chainId = import.meta.env.VITE_APP_APPKIT_CHAIN_ID || "bsc";
  const chainIdMap: Record<string, number> = {
    bsc: 56,
    bscTestnet: 97,
    polygon: 137,
    polygonAmoy: 80002,
    avax: 43114,
    avaxFuji: 43113,
    sonic: 146,
    sonicTestnet: 14601,
  };
  if (chainId in chainIdMap) {
    return chainIdMap[chainId];
  }
  throw new Error(`Unsupported chain ID: ${chainId}`);
};

export const walletConfig = getDefaultConfig({
  appName: import.meta.env.VITE_APP_TITLE || "Nexagon",
  projectId: import.meta.env.VITE_APP_APPKIT_PROJECT_ID || "",
  chains: [getNetwork()],
  wallets: [
    {
      groupName: "Recommended",
      wallets: [
        metaMaskWallet,
        trustWallet,
        walletConnectWallet,
        coinbaseWallet,
      ],
    },
    {
      groupName: "Others",
      wallets: [
        binanceWallet,
        rainbowWallet,
        phantomWallet,
        rabbyWallet,
        ledgerWallet,
        okxWallet,
        braveWallet,
        argentWallet,
        uniswapWallet,
        safepalWallet,
      ],
    },
  ],
});

export const weiToNumber = (value?: string, decimals = 18): number => {
  if (!value) return 0;
  try {
    const formatted = formatUnits(value, decimals);
    return parseFloat(formatted);
  } catch (e) {
    return 0;
  }
};

export const formatWei = (value?: string, decimals = 18, digits = 6): string => {
  return weiToNumber(value, decimals).toFixed(digits);
};