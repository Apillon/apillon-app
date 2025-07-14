import {
  arbitrum,
  arbitrumSepolia,
  astar,
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  celo,
  celoAlfajores,
  mainnet,
  moonbaseAlpha,
  moonbeam,
  optimism,
  optimismSepolia,
  polygon,
  polygonAmoy,
  sepolia,
} from 'viem/chains';

/**
 * Crypto
 */
export function chainIdToName(id: number) {
  if (id in EvmChain) {
    return EvmChain[id].toLowerCase().replaceAll('_', ' ');
  } else if (id in SubstrateChain) {
    return SubstrateChain[id].toLowerCase().replaceAll('_', ' ');
  }
  return '';
}

export function contractLink(contractAddress?: string | null, chainId?: number): string {
  return contractAddress ? `${chainRpc(chainId)}/address/${contractAddress}` : '';
}

export function transactionLink(transactionHash?: string | null, chainId?: number): string {
  if (!transactionHash) return '';

  switch (chainId) {
    case SubstrateChain.UNIQUE:
    case SubstrateChain.ASSET_HUB:
    case SubstrateChain.WESTEND_ASSET_HUB:
      return `${chainRpc(chainId)}/extrinsic/${transactionHash}`;
    default:
      return `${chainRpc(chainId)}/tx/${transactionHash}`;
  }
}
export function chainRpc(chainId?: number): string {
  switch (chainId) {
    // EVM Mainnet
    case EvmChainMainnet.ETHEREUM:
      return mainnet.blockExplorers.default.url;
    case EvmChainMainnet.MOONBEAM:
      return moonbeam.blockExplorers.default.url;
    case EvmChainMainnet.ASTAR:
      return astar.blockExplorers.default.url;
    case EvmChainMainnet.CELO:
      return celo.blockExplorers.default.url;
    case EvmChainMainnet.BASE:
      return base.blockExplorers.default.url;
    case EvmChainMainnet.ARBITRUM_ONE:
      return arbitrum.blockExplorers.default.url;
    case EvmChainMainnet.AVALANCHE:
      return avalanche.blockExplorers.default.url;
    case EvmChainMainnet.OPTIMISM:
      return optimism.blockExplorers.default.url;
    case EvmChainMainnet.POLYGON:
      return polygon.blockExplorers.default.url;

    // EVM Testnet
    case EvmChainTestnet.SEPOLIA:
      return sepolia.blockExplorers.default.url;
    case EvmChainTestnet.MOONBASE:
      return moonbaseAlpha.blockExplorers.default.url;
    case EvmChainTestnet.ALFAJORES:
      return celoAlfajores.blockExplorers.default.url;
    case EvmChainTestnet.BASE_SEPOLIA:
      return baseSepolia.blockExplorers.default.url;
    case EvmChainTestnet.ARBITRUM_ONE_SEPOLIA:
      return arbitrumSepolia.blockExplorers.default.url;
    case EvmChainTestnet.AVALANCHE_FUJI:
      return avalancheFuji.blockExplorers.default.url;
    case EvmChainTestnet.OPTIMISM_SEPOLIA:
      return optimismSepolia.blockExplorers.default.url;
    case EvmChainTestnet.POLYGON_AMOY:
      return polygonAmoy.blockExplorers.default.url;

    // Substrate Chains
    case SubstrateChain.ASTAR:
      return useRuntimeConfig().public.ENV === AppEnv.DEV ? `https://shibuya.subscan.io` : `https://astar.subscan.io`;
    case SubstrateChain.PHALA:
      return `https://phala.subscan.io`;
    case SubstrateChain.UNIQUE:
      return useRuntimeConfig().public.ENV === AppEnv.DEV ? `https://opal.subscan.io` : `https://unique.subscan.io`;
    case SubstrateChain.ASSET_HUB:
      return `https://assethub-polkadot.subscan.io`;
    case SubstrateChain.WESTEND_ASSET_HUB:
      return `https://assethub-westend.subscan.io`;

    default:
      console.warn('Missing chainId');
      return '';
  }
}

export function chainCurrency(chainId?: number) {
  switch (chainId) {
    case EvmChainMainnet.ASTAR:
      return 'ASTR';
    case EvmChainMainnet.ARBITRUM_ONE:
    case EvmChainTestnet.ARBITRUM_ONE_SEPOLIA:
      return 'ARB';
    case EvmChainMainnet.MOONBEAM:
      return 'GLMR';
    case EvmChainTestnet.MOONBASE:
      return 'DEV';
    case EvmChainMainnet.OPTIMISM:
    case EvmChainTestnet.OPTIMISM_SEPOLIA:
      return 'OP';
    case EvmChainMainnet.POLYGON:
    case EvmChainTestnet.POLYGON_AMOY:
      return 'POL';
    case SubstrateChain.UNIQUE:
      return 'UNQ';
    default:
      return 'ETH';
  }
}
