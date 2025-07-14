export function toHtmlNewlines(text: string, breaks = '<br/>') {
  if (!text) {
    return '';
  }

  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(\r?\n)|↵/g, breaks);
}

export function decodeHTMLEntities(text) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

export function shortHash(val: string) {
  if (!val || val.length <= 10) {
    return val;
  }
  return `${val.slice(0, 6)}...${val.slice(-4)}`;
}

export function removeLastSlash(val: string) {
  return val.replace(/\/$/, '');
}

export function zeroPad(num: string | number, size = 2) {
  let nums = num.toString();
  while (nums.length < size) {
    nums = '0' + num;
  }
  return nums;
}

export function equalsIgnoreCase(str1?: string, str2?: string) {
  return (
    str1 &&
    str2 &&
    str1.localeCompare(str2, undefined, {
      sensitivity: 'base',
    }) === 0
  );
}
export const toCamelCase = (str: string = '') =>
  str.toLowerCase().replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''));

/**
 * Return values separated by dash. If values are same, return only one value
 */
export function getOneOrRange(val1: number | string, val2: number | string) {
  if (val1 === val2) {
    return val1;
  }
  return val1 + '-' + val2;
}

export function getFormattedPrice(val = 0, moreOptions?: Intl.NumberFormatOptions, locale = 'en-US') {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'code',
    ...moreOptions,
  });

  return formatter.format(val).slice(4);
}

/**
 * To fixed and back to number to remove decimal when 0. eg 10.00 -> 10
 */
export function getFixed(num: number | string, places = 2, round = false, roundToDecimals = false) {
  if (!num) {
    num = 0;
  }

  if (typeof num !== 'number') {
    num = parseFloat(num);
  }

  if (roundToDecimals) {
    num = Math.floor(num * 10 * Math.pow(10, places)) / (10 * Math.pow(10, places));
  } else if (round) {
    return Math.round(num);
  }

  if (!places) {
    places = 0;
  }

  return parseFloat(num.toFixed(places));
}

export function getCompactValue(value: number | string, decimals = 2) {
  if (typeof value === 'string') {
    value = +value;
  }

  if (isNaN(value)) {
    return value;
  }

  if (value > 1000000) {
    return `${getFixed(value / 1000000, 3, false, true)}M`;
  } else if (value > 10000) {
    return `${getFixed(value / 1000, 2, false, true)}K`;
  }

  return `${getFixed(value, decimals)}`;
}

export function truncateWallet(source?: Optional<string>, partLength: number = 4): string {
  return source && source.length > 9
    ? source.slice(0, partLength) + '…' + source.slice(source.length - partLength, source.length)
    : source || '';
}

export function truncateCid(source: string, partLength: number = 4): string {
  return source && source.length > 9 ? source.slice(0, partLength) + '…' : source;
}

export function hideSecret(source: string, partLength: number = 4): string {
  return source && source.length > partLength
    ? '•'.repeat(source.length - partLength) + source.slice(source.length - partLength, source.length)
    : source;
}

export function toStr(s?: any) {
  return s ? s.toString() : '';
}

// Generate a secure unique password for the database
export const generatePassword = (length = 16) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

export const transformLinks = (str: string) => {
  return str.replace(/\[(.*?)\]\((.*?)\)/gi, (expr, text) => {
    try {
      const [_, link] = expr.substring(1, expr.length - 1).split('](');
      return text && link ? `<a href="${link}" class="link">${text}</a>` : expr;
    } catch (e: any) {
      console.error(e);
      return expr;
    }
  });
};

export function extractCIDFromUrl(link: string): string | null {
  try {
    // Normalize and parse URL
    if (!link.startsWith('http')) {
      // Handle protocols like ipfs:// or ipns://
      const match = link.match(/^(ipfs|ipns):\/\/([^/]+)/);
      if (match) {
        return match[2];
      }
    } else {
      const url = new URL(link);

      // Case: Subdomain gateway (e.g., https://<cid>.ipfs.gateway.com)
      const [possibleCID, protocol, ..._] = url.hostname.split('.');
      if ((protocol === 'ipfs' || protocol === 'ipns') && /^[a-z0-9]{46,}$/.test(possibleCID)) {
        return possibleCID;
      }

      // Case: Path-based gateway (e.g., https://gateway.com/ipfs/<cid>)
      const parts = url.pathname.split('/');
      const index = parts.findIndex(part => part === 'ipfs' || part === 'ipns');
      if (index !== -1 && parts[index + 1]) {
        return parts[index + 1];
      }
    }
  } catch (e: any) {
    console.warn(e);
  }
  return null;
}
