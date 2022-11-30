const storedFn = ref(null);

/**
 * Check that wallet is connected and matches logged-in user.
 * If it doesnt match, display AuthPopup with wallet login content
 * and execute callback function only after successful wallet connection.
 */
export default function useWalletCheck() {
  const store = useProviderStore();
  const auth = useAuthStore();

  function checkWallet(cb) {
    if (!store.provider || store.provider !== auth.crypto) {
      storedFn.value = cb;
    } else {
      cb();
    }
  }

  function triggerStoredFn() {
    if (storedFn.value) {
      storedFn.value();
      storedFn.value = null;
    }
  }

  function resetStoredFn() {
    storedFn.value = null;
  }

  return {
    checkWallet,
    triggerStoredFn,
    resetStoredFn,
  };
}
