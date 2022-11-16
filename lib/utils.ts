import { Validation } from '@vuelidate/core';
import { helpers } from '@vuelidate/validators';
import { FormItemRule } from 'naive-ui';
import { ApiErrorResponse } from '~~/types/error';

export function getVuelidateErrorMsg(v$: Validation, key: string) {
  if (!!v$[key] && v$[key].$invalid && v$[key].$errors.length) {
    return v$[key].$errors[0]?.$message || 'Value is not valid';
  }
  return '';
}

export const passwordStrengthValidators = {
  containsUppercase: helpers.withMessage('Must include an uppercase character', (value: string) =>
    /[A-Z]/.test(value)
  ),
  containsLowercase: helpers.withMessage('Must include a lowercase character', (value: string) =>
    /[a-z]/.test(value)
  ),
  containsNumber: helpers.withMessage('Must include a number', (value: string) =>
    /[0-9]/.test(value)
  ),
  containsSpecial: helpers.withMessage(
    'Must include a special character (#?!@$%^&*-)',
    (value: string) => /[#?!@$%^&*-]/.test(value)
  ),
};

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

/**
 * Custom validations
 */
/** Validate checkbox if it is checked */
export function validateRequiredCheckbox(_: FormItemRule, value: boolean | null): boolean {
  return value === true;
}

/**
 *  Date and time functions
 */
/** Time to days and hours */
export function timeToDays(time: String) {
  const [d, h, s] = time.split(':');
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
export function kbToMb(kb: number) {
  if (!+kb) return 0;
  return parseFloat(((kb / Math.pow(1024, 2)) * 1000).toFixed(0));
}

export function storagePercantage(size: number, maxSize: number) {
  return ((size / maxSize) * 100).toFixed(0);
}

/** Error messages */
export function userFriendlyMsg($i18n, error: ApiErrorResponse) {
  if (!$i18n || !$i18n.te('error.API') || !$i18n.t('error.API') || !error) {
    return 'Internal server error';
  }
  if (error.errors && Array.isArray(error.errors)) {
    return error.errors
      .map(e => singleErrorMessage($i18n, e.message, takeFirstDigitsFromNumber(e.statusCode)))
      .join(', ');
  } else if (error.message) {
    return singleErrorMessage($i18n, error.message, error.status);
  }
  return $i18n.t('error.API');
}

/** Translate single error message */
function singleErrorMessage($i18n, message: string, code: number) {
  if ($i18n.te(`error.${message}`)) {
    return $i18n.t(`error.${message}`);
  } else if (code >= 500) {
    return $i18n.t('error.DEFAULT_SYSTEM_ERROR');
  } else if (code >= 400) {
    return $i18n.t('error.BAD_REQUEST');
  }
}

/** statusCode to HTTP code */
function takeFirstDigitsFromNumber(num: number, numOfDigits: number = 3): number {
  return parseInt(String(num).slice(0, numOfDigits));
}
