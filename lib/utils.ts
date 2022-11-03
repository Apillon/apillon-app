import { Validation } from '@vuelidate/core';
import { helpers } from '@vuelidate/validators';
import { FormItemRule } from 'naive-ui';

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

export function ActionReturn(success: boolean, data: any) {
  return { success, data };
}

// Custom validations
export function validateRequiredCheckbox(_: FormItemRule, value: boolean | null): boolean {
  return value === true;
}
