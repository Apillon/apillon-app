import { useGtm } from '@gtm-support/vue-gtm';
import queryString from 'query-string';
import stg from '../config/staging';
import dev from '../config/development';
import prod from '../config/production';
import local from '../config/local';
import { Feature } from '../types/config';
import {
  CACHE_EXPIRATION_IN_MS,
  ON_COLUMN_CLICK_OPEN_CLASS,
  PAGINATION_LIMIT,
} from '../values/general.values';

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
    (item: EventTarget) =>
      (item as HTMLElement).tagName !== 'svg' &&
      (item as HTMLElement)?.className?.includes(ON_COLUMN_CLICK_OPEN_CLASS)
  );
}

/**
 * Actions
 */

export async function subscribeToNewsletter(email: string, username?: string): Promise<boolean> {
  const config = useRuntimeConfig();
  if (!config.public.mailerLiteSubscribeUrl) {
    return false;
  }

  const data = {
    'fields[email]': email,
    'fields[firstName]': username,
    'ml-submit': 1,
    anticsrf: true,
    ajax: 1,
  };
  const URL =
    config.public.mailerLiteSubscribeUrl +
    '?' +
    queryString.stringify(data, { arrayFormat: 'comma' });

  try {
    await fetch(URL, {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    }).then(response => response.json());

    window.$message.success(window.$i18n.t('form.success.newsletter.subscribed'));

    localStorage.setItem(LS_KEY_NEWSLETTER, email);
  } catch (error: ApiError | ReferenceError | any) {
    window.$message.error(userFriendlyMsg(error));
    return false;
  }
  return true;
}

export function translateItems(key: string): String[] {
  const { t, te } = useI18n();
  return Array.from(Array(10).keys()).reduce((accumulator: String[], i) => {
    if (te(`${key}.${i}`) && t(`${key}.${i}`)) {
      accumulator.push(t(`${key}.${i}`));
    }
    return accumulator;
  }, [] as String[]);
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

/** Parse base method argument to request params */
export function parseArguments(args: FetchParams): Record<string, string | number> {
  const params: Record<string, string | number> = {
    page: args.page || 1,
    limit: args.limit || PAGINATION_LIMIT,
    orderBy: args.orderBy || 'createTime',
    desc: args.order === 'descend' || !args.orderBy ? 'true' : 'false',
  };

  if (args.search) {
    params.search = args.search;
  }

  return params;
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

/**
 * Get the value of a cookie
 * @param  {String} name  The name of the cookie
 * @return {String}       The cookie value
 */
export function readCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts: String[] = value.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop()?.split(';')?.shift() || '' : '';
}
