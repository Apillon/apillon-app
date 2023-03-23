export default function useProvider() {
  const authStore = useAuthStore();

  async function getMessageSignature(address: string, msg: string) {
    const signer = authStore.wallet.provider?.signer;

    if (signer && signer.signRaw) {
      try {
        const signPromise = await signer.signRaw({
          address,
          data: msg,
          type: 'bytes',
        });

        return signPromise.signature;
      } catch (e) {
        console.error(e);
      }
    }

    return '';
  }

  return {
    getMessageSignature,
  };
}
