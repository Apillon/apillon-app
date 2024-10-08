export function timeout(callback: () => Promise<any>, timeLimit: number) {
  return new Promise(async (resolve, reject) => {
    const _timeout = setTimeout(() => reject(new Error('Timed out.')), timeLimit);

    try {
      const result = await callback();

      clearTimeout(_timeout);
      resolve(result);
    } catch (e) {
      clearTimeout(_timeout);
      reject(e);
    }
  });
}
