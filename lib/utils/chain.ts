/**
 * Crypto
 */
export function chainIdToName(id: number) {
  if (id in EvmChain) {
    return EvmChain[id].toLowerCase();
  } else if (id in SubstrateChain) {
    return SubstrateChain[id].toLowerCase();
  }
  return '';
}

export function contractLink(contractAddress?: string | null, chainId?: number): string {
  return contractAddress ? `${chainRpc(chainId)}address/${contractAddress}` : '';
}

export function transactionLink(transactionHash?: string | null, chainId?: number): string {
  if (!transactionHash) return '';

  switch (chainId) {
    case SubstrateChain.UNIQUE:
    case SubstrateChain.ASSET_HUB:
    case SubstrateChain.WESTEND_ASSET_HUB:
      return `${chainRpc(chainId)}extrinsic/${transactionHash}`;
    default:
      return `${chainRpc(chainId)}tx/${transactionHash}`;
  }
}
export function chainRpc(chainId?: number): string {
  switch (chainId) {
    // EVM Mainnet
    case EvmChainMainnet.ETHEREUM:
      return `https://etherscan.io/`;
    case EvmChainMainnet.MOONBEAM:
      return `https://moonbeam.moonscan.io/`;
    case EvmChainMainnet.ASTAR:
      return `https://astar.blockscout.com/`;
    case EvmChainMainnet.CELO:
      return `https://celo.blockscout.com/`;
    case EvmChainMainnet.BASE:
      return `https://basescan.org/`;
    case EvmChainMainnet.ARBITRUM_ONE:
      return `https://arbiscan.io/`;
    case EvmChainMainnet.AVALANCHE:
      return `https://snowtrace.io/`;
    case EvmChainMainnet.OPTIMISM:
      return `https://optimistic.etherscan.io/`;
    case EvmChainMainnet.POLYGON:
      return `https://polygonscan.com/`;

    // EVM Testnet
    case EvmChainTestnet.SEPOLIA:
      return `https://sepolia.etherscan.io/`;
    case EvmChainTestnet.MOONBASE:
      return `https://moonbase.moonscan.io/`;
    case EvmChainTestnet.ALFAJORES:
      return `https://celo-alfajores.blockscout.com/`;
    case EvmChainTestnet.BASE_SEPOLIA:
      return `https://sepolia.basescan.org/`;
    case EvmChainTestnet.ARBITRUM_ONE_SEPOLIA:
      return `https://sepolia.arbiscan.io/`;
    case EvmChainTestnet.AVALANCHE_FUJI:
      return `https://testnet.snowtrace.io/`;
    case EvmChainTestnet.OPTIMISM_SEPOLIA:
      return `https://sepolia-optimism.etherscan.io/`;
    case EvmChainTestnet.POLYGON_AMOY:
      return `https://amoy.polygonscan.com/`;

    // Substrate Chains
    case SubstrateChain.ASTAR:
      return useRuntimeConfig().public.ENV === AppEnv.DEV ? `https://shibuya.subscan.io/` : `https://astar.subscan.io/`;
    case SubstrateChain.PHALA:
      return `https://phala.subscan.io/`;
    case SubstrateChain.UNIQUE:
      return useRuntimeConfig().public.ENV === AppEnv.DEV ? `https://opal.subscan.io/` : `https://unique.subscan.io/`;
    case SubstrateChain.ASSET_HUB:
      return `https://assethub-polkadot.subscan.io/`;
    case SubstrateChain.WESTEND_ASSET_HUB:
      return `https://assethub-westend.subscan.io/`;

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
