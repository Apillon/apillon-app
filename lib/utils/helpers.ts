export function sleep(timeMs = 1000) {
  return new Promise(resolve => setTimeout(resolve, timeMs));
}

export function delay(fn: Function, delay = 500) {
  setTimeout(fn, delay);
}

export const placeholderPixel =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP88x8AAv0B/cfFKfIAAAAASUVORK5CYII=';

/**
 * min/max inclusive
 */
export function randomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function isNumeric(n: any): n is number | string {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export function intVal(n: number | string): number {
  return typeof n === 'number' ? n : parseInt(n, 10);
}

export function getEncodedPathAndQuery(route: any) {
  const query = !route.query
    ? ''
    : Object.keys(route.query)
        .map(x => `${x}${route.query[x] ? `=${route.query[x]}` : ''}`)
        .join('&');

  return encodeURIComponent(`${route.path.replace(/\/+$/, '')}/?${query || ''}`);
}

export function getDecodedPathAndQuery(routeStr: string) {
  if (!routeStr || typeof routeStr !== 'string') {
    return '';
  }

  const parts = decodeURIComponent(routeStr).split('?');

  if (parts.length > 1 && !!parts[1]) {
    // Path + query
    const queryStrings = parts[1].split('&');
    const query = {} as any;
    queryStrings.forEach(x => {
      if (x) {
        const sides = x.split('=');
        if (sides.length > 1) {
          query[sides[0]] = sides[1];
        }
      }
    });
    return { path: parts[0], query };
  } else {
    // Just path
    return parts[0];
  }
}

export function areArraysEqual(a1: any, a2: any, sorted = false) {
  if (!a1 || !a2 || !Array.isArray(a1) || !Array.isArray(a2) || a1.length !== a2.length) {
    return false;
  }

  if (sorted) {
    a1 = [...a1].sort();
    a2 = [...a2].sort();
  }

  for (let i = 0; i < a1.length; i++) {
    if (a1[i] !== a2[i]) {
      return false;
    }
  }

  return true;
}

/** Copy text to clipboard */
export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(
    () => {
      if (!window.$message) return;
      /* Resolved - text copied to clipboard successfully */
      if (window.$i18n?.te('dashboard.clipboard.copied')) {
        window.$message.success(window.$i18n.t('dashboard.clipboard.copied'));
      } else {
        window.$message.success('Text has been copied to clipboard');
      }
    },
    () => {
      if (!window.$message) return;
      /* Rejected - text failed to copy to the clipboard */
      if (window.$i18n?.te('dashboard.clipboard.error')) {
        window.$message.warning(window.$i18n.t('dashboard.clipboard.error'));
      } else {
        window.$message.warning('Failed to copy');
      }
    }
  );
}
export function copyToClipboardWithResponseTexts(text: string, successMsg?: string, errorMsg?: string) {
  navigator.clipboard.writeText(text).then(
    () => {
      /* Resolved - text copied to clipboard successfully */
      if (successMsg) {
        window.$message.success(successMsg);
      } else {
        window.$message.success('Text has been copied to clipboard');
      }
    },
    () => {
      /* Rejected - text failed to copy to the clipboard */
      if (errorMsg) {
        window.$message.warning(errorMsg);
      } else {
        window.$message.warning('Failed to copy');
      }
    }
  );
}

/**
 *  Format numbers
 */
/** Add dots and commas */
export function formatNumber(n: number) {
  return new Intl.NumberFormat('en-US').format(n);
}

export function formatPrice(price: number, currency = 'usd') {
  const decimals = Math.ceil(price) === price ? 0 : 2;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
  }).format(price);
}

export function formatCurrency(currency: string) {
  return currency === 'eur' ? '€' : '$';
}

export function generatePriceServiceName(service: string, chain: number, action: string) {
  const chainName = EvmChain[chain] || SubstrateChain[chain];
  return service + '_' + chainName + '_' + action;
}

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

/**
 * OG data
 */
export function prepareOG(
  title = 'Apillon - Web3 development platform.',
  description = 'Robust infrastructure for developers. Few-click solutions for everyone else.',
  image = 'https://app.apillon.io/images/apillon_og.jpg',
  url = 'https://app.apillon.io/'
) {
  return {
    title,
    ogTitle: title,
    twitterTitle: title,
    description,
    ogDescription: description,
    twitterDescription: description,
    ogImage: image,
    twitterImage: image,
    ogUrl: url,
  };
}

export function createPagination(remote = true) {
  const { t } = useI18n();
  return {
    itemCount: remote ? 0 : undefined,
    page: remote ? 1 : undefined,
    pageSize: PAGINATION_LIMIT,
    showSizePicker: true,
    pageSizes: enumValues(PageSize) as number[],
    prefix({ itemCount }) {
      return t('general.total', { total: itemCount });
    },
  };
}
