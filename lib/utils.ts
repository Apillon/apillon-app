import { Validation } from '@vuelidate/core';
import { helpers } from '@vuelidate/validators';
import dev from '../config/development';
import stg from '../config/staging';
import prod from '../config/production';
import local from '../config/local';

export function getAppConfig() {
  const env = process.env ? (process.env.ENV ? process.env.ENV : process.env.NODE_ENV) : null;
  if (env === 'production') {
    return prod;
  } else if (env === 'staging') {
    return stg;
  } else if (env === 'development') {
    return dev;
  } else {
    return local;
  }
}

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

export function removeLastSlash(val: string) {
  if (!val) {
    return val;
  }
  return val.replace(/\/$/, '');
}
