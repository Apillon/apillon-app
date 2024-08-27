const btnLoading = ref(false);
const isWalletConnected = ref(false);

export default function assetHub() {
  async function connectWallet() {
    isWalletConnected.value = true;
    // if (!isConnected.value) {
    //   await wagmiConnect(connectors.value[0]);
    // }
  }

  //   async function onWalletConnected() {
  //     await sleep(200);
  //     if (btnLoading.value) {
  //       btnLoading.value = false;
  //     }
  //   }

  //   function wagmiConnect(connector) {
  //     if (isConnected.value) {
  //       refetchWalletClient();
  //     } else if (connector.ready) {
  //       connect({ connector });
  //     }
  //   }

  //   function disconnectWallet() {
  //     disconnect();
  //   }

  return {
    isWalletConnected,
    connectWallet,
    // disconnectWallet,
    // btnLoading,
  };
}
