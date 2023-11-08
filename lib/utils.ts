import { type LocationQueryValue } from 'vue-router';
import { useGtm } from '@gtm-support/vue-gtm';
import stg from '../config/staging';
import dev from '../config/development';
import prod from '../config/production';
import local from '../config/local';
import { Feature } from '~~/types/config';

export function getAppConfig(env?: string) {
  const configFile =
    env === 'staging' ? stg : env === 'development' ? dev : env === 'local' ? local : prod;
  return {
    ...configFile,
    ENV: env,
  };
}

/**
 * Analytics GTM
 */
export function trackEvent(eventName: string, eventCategory = 'Dashboard', eventAction = 'click') {
  const gtm = useGtm();
  if (gtm && gtm.enabled()) {
    gtm.trackEvent({
      event: eventName,
      category: eventCategory,
      action: eventAction,
    });
  }
}

/**
 * Enum
 */
export function enumKeys(E: any): string[] {
  return Object.keys(E).filter(k => isNaN(Number(k)));
}
export function enumValues(E: any): string[] | number[] {
  return enumKeys(E).map(k => E[k as any]);
}
export function enumKeyValues(E: any): KeyValue[] {
  return enumKeys(E).map(k => {
    return { key: k, label: k, value: E[k as any] };
  });
}

/**
 * Numeric manipulations
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

export function ActionReturn(success: boolean, data: any) {
  return { success, data };
}

/**
 * String manipulations
 * */
export function removeLastSlash(val: string) {
  if (!val) {
    return val;
  }
  return val.replace(/\/$/, '');
}
export function truncateWallet(source: string, partLength: number = 4): string {
  return source.length > 9
    ? source.slice(0, partLength) + '…' + source.slice(source.length - partLength, source.length)
    : source;
}
export function truncateCid(source: string, partLength: number = 4): string {
  return source && source.length > 9 ? source.slice(0, partLength) + '…' : source;
}
export function hideSecret(source: string, partLength: number = 4): string {
  return source && source.length > partLength
    ? '•'.repeat(source.length - partLength) +
        source.slice(source.length - partLength, source.length)
    : source;
}
export function toStr(s: LocationQueryValue | LocationQueryValue[]) {
  return s ? s.toString() : '';
}

/**
 *  Format numbers
 */
/** Add dots and commas */
export function formatNumber(n: number) {
  return new Intl.NumberFormat('de-DE').format(n);
}

export function formatPrice(price: number, currency?: string) {
  if (currency) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency }).format(price);
  }
  return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2 }).format(price);
}

export function formatCurrency(currency: string) {
  return currency === 'eur' ? '€' : '$';
}

/**
 *  Date and time functions
 */
/** Time to days and hours */
export function timeToDays(time: String): string {
  if (!time) return '';

  const [d, h, s] = time.split(':');
  if (!d || !h || !s) return `${time}`;

  const days = parseInt(d);
  const hours = parseInt(h);
  const seconds = parseInt(s);

  if (days > 1) {
    return `${days}d`;
  } else if (days > 0 && hours > 1) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${seconds}s`;
  } else if (seconds > 0) {
    return `${seconds}s`;
  } else {
    return `${days}d ${hours}h ${seconds}s`;
  }
}

/** DateTime to date: "2022-12-13T07:21:50.000Z" -> 13 Dec, 2022  */
export function dateTimeToDate(dateTime: string): string {
  if (!dateTime) return '';

  const date = new Date(dateTime);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-us', options);
}
export function dateTimeToDateAndTime(dateTime: string): string {
  if (!dateTime) return '';

  const date = new Date(dateTime);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  return date.toLocaleDateString('en-us', options);
}
/** Timestamp in seconds to DateTime */
export function timestampToDateAndTime(timestamp: number): string {
  if (!timestamp) return '';

  const date = new Date(timestamp * 1000);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  return date.toLocaleDateString('en-us', options);
}
/** Deleted files - add 6 months */
export function dateTimeToDateForDeletedFiles(dateTime: string): string {
  if (!dateTime) return '';

  const date = new Date(dateTime);
  date.setMonth(date.getMonth() + 6);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-us', options);
}

/**
 * Calculate expiration date on CRUST
 * @param calculatedAt block number when file has been created
 * @param expiredAt block number when file will expire
 * @returns
 */
export function fileExpiration(
  calculatedAt: number,
  expiredAt: number,
  fileUpdateTime: string,
  currentBlockId?: number
): string {
  const TIME_TO_CREATE_NEW_BLOCK = 6000;
  const useBlockToCalc = currentBlockId && currentBlockId > 0 ? currentBlockId : calculatedAt;

  const numOfRemainingBlocks = expiredAt - useBlockToCalc;

  const expiredAtDate = !currentBlockId
    ? new Date(new Date(fileUpdateTime).getTime() + TIME_TO_CREATE_NEW_BLOCK * numOfRemainingBlocks)
    : new Date(Date.now() + TIME_TO_CREATE_NEW_BLOCK * numOfRemainingBlocks);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return expiredAtDate.toLocaleDateString('en-us', options);
}

/**
 * Error messages
 */
export function userFriendlyMsg(error: ApiError | ReferenceError | TypeError | DOMException | any) {
  // Check error exists and if translation is included
  if (!window.$i18n || !(window.$i18n instanceof Object) || !error) {
    if (error instanceof ReferenceError || error instanceof TypeError) {
      return error.message;
    }
    return 'Internal server error';
  }

  // Check error type
  if (instanceOfApiError(error)) {
    // Beautify API error
    const err = error as ApiError;
    if (err.errors && Array.isArray(err.errors)) {
      const errorMessages = err.errors.map(e =>
        singleErrorMessage(window.$i18n, e.message, e.statusCode)
      );
      return [...new Set(errorMessages)].join('\n');
    } else if (err.message) {
      return singleErrorMessage(window.$i18n, err.message, err.code || err.status);
    }
  } else if (error instanceof ReferenceError || error instanceof TypeError) {
    return window.$i18n.te(`error.${error.message}`)
      ? window.$i18n.t(`error.${error.message}`)
      : error.message;
  }

  return window.$i18n.t('error.API');
}

/** Translate single error message */
function singleErrorMessage($i18n: i18nType, message: string, statusCode: number = 0) {
  const code = takeFirstDigitsFromNumber(statusCode);
  if ($i18n.te(`error.${message}`)) {
    return $i18n.t(`error.${message}`);
  } else if ($i18n.te(`error.${statusCode}`)) {
    return $i18n.t(`error.${statusCode}`);
  } else if (code >= 500) {
    return $i18n.t('error.DEFAULT_SYSTEM_ERROR');
  } else if (code >= 400) {
    return $i18n.t('error.BAD_REQUEST');
  }
  return $i18n.t('error.API');
}

/** Check if object is instance of ApiError  */
function instanceOfApiError(object: any): object is ApiError {
  return ('code' in object || 'status' in object) && ('errors' in object || 'message' in object);
}

/** statusCode to HTTP code */
function takeFirstDigitsFromNumber(num: number, numOfDigits: number = 3): number {
  return parseInt(String(num).slice(0, numOfDigits));
}

/** Feature flags - check if feature is enabled */
export function isFeatureEnabled(feature: Feature | string, userRoles: number[]): boolean {
  const config = useRuntimeConfig();
  let enabledFeatures = config.public.publishedFeatures;

  if (userRoles?.length && userRoles.includes(DefaultUserRole.BETA_USER)) {
    enabledFeatures = [...enabledFeatures, ...config.public.betaFeatures];
  }

  return enabledFeatures.includes(feature) || false;
}

/** Check if any of elements contains class ${ON_COLUMN_CLICK_OPEN_CLASS}, which means this column is clickable */
export function canOpenColumnCell(path: EventTarget[]) {
  return path.some(
    (item: EventTarget) => (item as HTMLElement)?.className?.includes(ON_COLUMN_CLICK_OPEN_CLASS)
  );
}

/**
 * Actions
 */

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
 * Cache expiration
 */
export function isCacheExpired(key: string) {
  const timestamp = sessionStorage.getItem(key);
  if (timestamp) {
    return parseInt(timestamp) + CACHE_EXPIRATION_IN_MS < Date.now();
  }
  return true;
}

/**
 * Slice array in chunks
 */
export function sliceIntoChunks(arr: Array<any>, chunkSize: number) {
  const res: Array<any> = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

/**
 * Compare arrays
 */
export const compareArrays = (a: Array<any>, b: Array<any>) => {
  const bs = b.sort();
  return a.length === b.length && a.sort().every((element, index) => element === bs[index]);
};

/** Browser, device */
export function getBrowserName(): string {
  if (navigator.userAgent.includes('Firefox')) {
    return 'firefox';
  } else if (navigator.userAgent.includes('MSIE')) {
    return 'ie';
  } else if (navigator.userAgent.includes('Edge')) {
    return 'edge';
  } else if (navigator.userAgent.includes('Safari')) {
    return 'safari';
  } else if (navigator.userAgent.includes('Opera')) {
    return 'opera';
  }
  return 'chrome';
}
export function getDeviceName() {
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator?.userAgentData?.platform || window.navigator.platform;
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
  const iosPlatforms = ['iPhone', 'iPad', 'iPod'];

  if (macosPlatforms.includes(platform)) {
    return 'mac';
  } else if (iosPlatforms.includes(platform)) {
    return 'ios';
  } else if (windowsPlatforms.includes(platform)) {
    return 'windows';
  } else if (/Android/.test(userAgent)) {
    return 'android';
  } else if (/Linux/.test(platform)) {
    return 'linux';
  }
  return '';
}

export function generatePriceServiceName(service: string, chain: number, action: string) {
  return service + '_' + Chains[chain] + '_' + action;
}
