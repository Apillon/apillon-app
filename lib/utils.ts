import stg from '../config/staging';
import dev from '../config/development';
import prod from '../config/production';
import local from '../config/local';
import { Feature } from '~~/types/config';

export function getAppConfig(env?: string) {
  if (!env) {
    return prod;
  }
  if (env === 'staging') {
    return stg;
  } else if (env === 'development') {
    return dev;
  } else if (env === 'local') {
    return local;
  } else {
    return prod;
  }
}

export function randomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

/**
 * Custom validations
 */
/** Validate checkbox if it is checked */
export function validateRequiredCheckbox(_: NFormItemRule, value: boolean | null): boolean {
  return value === true;
}

/**
 *  Date and time functions
 */
/** Time to days and hours */
export function timeToDays(time: String): string {
  if (!time) return;

  const [d, h, s] = time.split(':');
  if (!d || !h || !s) return time;

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

/** Storage calculations */
export function kbToMb(kb: number): number {
  if (!+kb) return 0;
  return parseFloat(((kb / Math.pow(1024, 2)) * 1000).toFixed(0));
}

export function storagePercantage(size: number, maxSize: number): number {
  return parseInt(((size / maxSize) * 100).toFixed(0));
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (!+bytes) return '';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function fileExpiration(expiredAt: number): string {
  const expiredAtDate = new Date(Date.now() + expiredAt);
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
export function userFriendlyMsg(
  error: ApiError | ReferenceError | TypeError | any,
  $i18n: any = null
) {
  // Check error exists and if translation is included
  if (!$i18n || !($i18n instanceof Object) || !error) {
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
      return err.errors
        .map(e => singleErrorMessage($i18n, e.message, takeFirstDigitsFromNumber(e.statusCode)))
        .join(', ');
    } else if (err.message) {
      return singleErrorMessage($i18n, err.message, err.status);
    }
  } else if (error instanceof ReferenceError || error instanceof TypeError) {
    return $i18n.te(`error.${error.message}`) ? $i18n.t(`error.${error.message}`) : error.message;
  }

  return $i18n.t('error.API');
}

/** Translate single error message */
function singleErrorMessage($i18n: any, message: string, code: number = 0) {
  if ($i18n.te(`error.${message}`)) {
    return $i18n.t(`error.${message}`);
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
export function isFeatureEnabled(feature: Feature): boolean {
  const config = useRuntimeConfig();
  return config.public.features[feature] || false;
}
