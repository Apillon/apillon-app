import type { FormItemRule } from 'naive-ui';

export function ruleRequired(errMsg: string) {
  return {
    required: true,
    message: errMsg,
  };
}
export function ruleDescription(errMsg: string) {
  return {
    max: 255,
    message: errMsg,
    trigger: 'input',
  };
}
export function ruleNaturalNumber(errMsg: string) {
  return {
    validator: validateNaturalNumber,
    message: errMsg,
  };
}

/**
 * Custom validations
 */
/** Validate checkbox if it is checked */
export function validateRequiredCheckbox(_: FormItemRule, value: boolean | null): boolean {
  return value === true;
}

/** Validate dropdown if it is selected */
export function validateRequiredDropdown(_: FormItemRule, value: String | null): boolean {
  if (value) {
    return value.length !== 0;
  } else {
    return false;
  }
}

/** Validate Ethereum address */
export function validateEvmAddress(_: FormItemRule, value: string | null): boolean {
  return !!value && /^0x[a-fA-F0-9]{40}$/i.test(value);
}
export function validateNaturalNumber(_: FormItemRule, value: number | string | null): boolean {
  return value !== null && intVal(value) >= 0;
}
export function validateNumberNotZero(_: FormItemRule, value: number | string | null): boolean {
  return !!value && intVal(value) > 0;
}
