/**
 *  Date and time functions
 */
/** Time to days and hours */
export function timeToDays(time: string): string {
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
