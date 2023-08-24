export function ruleRequired(errMsg: string) {
  return {
    required: true,
    message: errMsg,
  };
}

/**
 * Custom validations
 */
/** Validate checkbox if it is checked */
export function validateRequiredCheckbox(_: NFormItemRule, value: boolean | null): boolean {
  return value === true;
}

/** Validate dropdown if it is selected */
export function validateRequiredDropdown(_: NFormItemRule, value: String | null): boolean {
  if (value) {
    return value.length !== 0;
  } else {
    return false;
  }
}
