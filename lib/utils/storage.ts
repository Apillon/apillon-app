import { textMarshal } from 'text-marshal';

/** Size calculations */
export function kbToMb(kb: number): number {
  if (!+kb) return 0;
  return parseFloat((kb / Math.pow(1024, 1)).toFixed(2));
}
export function bytesToMb(bytes: number): number {
  if (!+bytes) return 0;
  return parseFloat((bytes / Math.pow(1024, 2)).toFixed(2));
}

export function storagePercentage(size: number, maxSize: number): number {
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
 * Download file
 * @param url
 * @param filename
 */
export async function download(url: string, filename: string) {
  return await fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    })
    .catch(console.error);
}

/**
 * File extension
 */
export function getExtension(filename: string): string {
  return filename.split('.').pop() || '';
}

/** Format folder name (remove dissallowed characters) */
export function stripFolderName(value: string | [string, string]) {
  return textMarshal({
    input: value,
    template: 'x',
    disallowCharacters: [/@/, /\\/, /\//, /\|/, /\!/, /\#/, /\$/, /\%/, /\^/, /\&/, /\*/],
    isRepeat: {
      value: true,
      removeStart: true,
      removeEnd: true,
    },
  }).marshaltext;
}

/** Convert file to text */
export const fileTypeBasedOnBase64 = fileContent => {
  try {
    return fileContent.split(';')[0].split(':')[1];
  } catch (error) {
    return '';
  }
};

/** Convert file to base64 */
export const convertBase64 = file => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = error => {
      reject(error);
    };
  });
};

/** Convert file to text */
export const convertFileToText = file => {
  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsText(file);

    fileReader.onload = () => {
      resolve(fileReader.result as string);
    };

    fileReader.onerror = error => {
      reject(error);
    };
  });
};

/** Convert file to ArrayBuffer */
export const convertFileContentToArray = (file: File) => {
  return new Promise<Uint8Array>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = () => {
      resolve(new Uint8Array(fileReader.result as ArrayBufferLike));
    };

    fileReader.onerror = error => {
      reject(error);
    };
  });
};

/** Read file content */
export const readFileContent = file => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsText(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = error => {
      reject(error);
    };
  });
};

export function removeSurroundingQuotes(str: string): string {
  return str.replace(/^'+|'+$/g, '');
}
