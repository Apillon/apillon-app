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
