import { textMarshal } from 'text-marshal';
import { importer, type UserImporterOptions } from 'ipfs-unixfs-importer';

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

/** Format folder name (remove disallowed characters) */
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

const block = {
  get: async cid => {
    throw new Error(`unexpected block API get for ${cid}`);
  },
  put: async () => {
    throw new Error('unexpected block API put');
  },
};

export const calculateCID = async (content: any, options: UserImporterOptions) => {
  options.onlyHash = true;

  if (typeof content === 'string') {
    content = new TextEncoder().encode(content);
  }

  let lastCid;
  for await (const { cid } of importer([{ content }], block, options)) {
    lastCid = cid;
  }

  return `${lastCid}`;
};

export const websiteLink = (website: WebsiteBaseInterface | WebsiteInterface) => {
  const pathEnd = website.source === WebsiteSource.GITHUB || !!website.nftCollectionUuid ? '/deployments' : '';
  return `/dashboard/service/hosting/${website.website_uuid}${pathEnd}`;
};
