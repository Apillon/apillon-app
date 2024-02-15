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
export function copyToClipboardWithResponseTexts(
  text: string,
  successMsg?: string,
  errorMsg?: string
) {
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
  return service + '_' + Chains[chain] + '_' + action;
}

/**
 * Crypto
 */

export function contractLink(contractAddress?: string | null, chainId?: number): string {
  switch (chainId) {
    case Chains.MOONBEAM:
      return contractAddress
        ? `https://moonbeam.moonscan.io/address/${contractAddress}`
        : 'https://moonbeam.moonscan.io';
    case Chains.MOONBASE:
      return contractAddress
        ? `https://moonbase.moonscan.io/address/${contractAddress}`
        : 'https://moonbase.moonscan.io';
    case Chains.ASTAR:
      return contractAddress
        ? `https://astar.subscan.io/address/${contractAddress}`
        : 'https://astar.subscan.io';
    case SubstrateChain.PHALA:
      return contractAddress
        ? `https://phala.subscan.io/address/${contractAddress}`
        : 'https://phala.subscan.io';
    default:
      console.warn('Missing chainId');
      return '';
  }
}

export function transactionLink(transactionHash?: string | null, chainId?: number): string {
  switch (chainId) {
    case Chains.MOONBEAM:
      return transactionHash
        ? `https://moonbeam.moonscan.io/tx/${transactionHash}`
        : 'https://moonbeam.moonscan.io';
    case Chains.MOONBASE:
      return transactionHash
        ? `https://moonbase.moonscan.io/tx/${transactionHash}`
        : 'https://moonbase.moonscan.io';
    case Chains.ASTAR:
      return transactionHash
        ? `https://astar.subscan.io/tx/${transactionHash}`
        : 'https://astar.subscan.io';
    case SubstrateChain.PHALA:
      return transactionHash
        ? `https://phala.subscan.io/tx/${transactionHash}`
        : 'https://phala.subscan.io';
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
