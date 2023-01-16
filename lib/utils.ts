import stg from '../config/staging';
import dev from '../config/development';
import prod from '../config/production';
import local from '../config/local';
import { Feature } from '~~/types/config';
import { NuxtLink } from '~~/.nuxt/components';

export function getAppConfig(env?: string) {
  const configFile =
    env === 'staging' ? stg : env === 'development' ? dev : env === 'local' ? local : prod;
  return {
    ...configFile,
    ENV: env,
  };
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

/**
 * Custom validations
 */
/** Validate checkbox if it is checked */
export function validateRequiredCheckbox(_: NFormItemRule, value: boolean | null): boolean {
  console.log('Checkboy validation');
  return value === true;
}

/** Validate dropdown if it is selected */
export function validateRequiredDropdown(_: NFormItemRule, value: String | null): boolean {
  console.log('Dropdown validation');
  if (value) {
    return value.length !== 0;
  } else {
    return false;
  }
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

/** Datetime to date: "2022-12-13T07:21:50.000Z" -> 13 Dec, 2022  */
export function datetimeToDate(datetime: string): string {
  const date = new Date(datetime);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-us', options);
}

/** Storage calculations */
export function kbToMb(kb: number): number {
  if (!+kb) return 0;
  return parseFloat((kb / Math.pow(1024, 1)).toFixed(2));
}
export function bytesToMb(bytes: number): number {
  if (!+bytes) return 0;
  return parseFloat((bytes / Math.pow(1024, 2)).toFixed(2));
}

export function storagePercantage(size: number, maxSize: number): number {
  return parseInt(((size / maxSize) * 100).toFixed(0));
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (!+bytes) return '0 KB';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Calculate expiration date on CRUST
 * @param calculatedAt block number when file has been created
 * @param expiredAt block number when file will expire
 * @returns
 */
export function fileExpiration(calculatedAt: number, expiredAt: number): string {
  const TIME_TO_CREATE_NEW_BLOCK = 6000;
  const numOfBlocksBeforeExpiratoin = expiredAt - calculatedAt;

  const expiredAtDate = new Date(
    Date.now() + TIME_TO_CREATE_NEW_BLOCK * numOfBlocksBeforeExpiratoin
  );
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return expiredAtDate.toLocaleDateString('en-us', options);
}

/** Bucket - calculate additional data */
export function addBucketAdditionalData(bucket: BucketInterface): BucketInterface {
  return {
    ...bucket,
    sizeMb: bytesToMb(bucket.size || 0),
    maxSizeMb: bytesToMb(bucket.maxSize),
    percentage: storagePercantage(bucket.size || 0, bucket.maxSize),
  };
}

/**
 * Error messages
 */
export function userFriendlyMsg(error: ApiError | ReferenceError | TypeError | any) {
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
      return err.errors
        .map(e =>
          singleErrorMessage(window.$i18n, e.message, takeFirstDigitsFromNumber(e.statusCode))
        )
        .join(', ');
    } else if (err.message) {
      return singleErrorMessage(window.$i18n, err.message, err.status);
    }
  } else if (error instanceof ReferenceError || error instanceof TypeError) {
    return window.$i18n.te(`error.${error.message}`)
      ? window.$i18n.t(`error.${error.message}`)
      : error.message;
  }

  return window.$i18n.t('error.API');
}

/** Translate single error message */
function singleErrorMessage($i18n: i18nType, message: string, code: number = 0) {
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

/** Check if any of elements contains class ${ON_COLUMN_CLICK_OPEN_CLASS}, which means this column is clickable */
export function canOpenColumnCell(path: EventTarget[]) {
  return (
    path.find((item: EventTarget) =>
      (item as HTMLElement)?.className?.includes(ON_COLUMN_CLICK_OPEN_CLASS)
    ) !== undefined
  );
}

/**
 * Actions
 */

/**
 * Download file
 * @param url
 * @param filename
 */
export async function download(url: string, filename: string) {
  return fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    })
    .catch(console.error);
}

/** Copy text to clipboard */
export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(
    () => {
      /* Resolved - text copied to clipboard successfully */
      if (window.$i18n?.te('dashboard.clipboard.copied')) {
        window.$message.success(window.$i18n.t('dashboard.clipboard.copied'));
      } else {
        window.$message.success('Text has been copied to clipboard');
      }
    },
    () => {
      /* Rejected - text failed to copy to the clipboard */
      if (window.$i18n?.te('dashboard.clipboard.error')) {
        window.$message.success(window.$i18n.t('dashboard.clipboard.error'));
      } else {
        window.$message.success('Failed to copy');
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
        window.$message.success(errorMsg);
      } else {
        window.$message.success('Failed to copy');
      }
    }
  );
}
