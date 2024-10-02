import { useAccount, useConnect, useDisconnect, useWalletClient } from 'use-wagmi';

export default function assetHub() {
  const { t } = useI18n();
  const authStore = useAuthStore();
  const referralStore = useReferralStore();
  const { error, success } = useMessage();
  const { connectAndSign } = useWallet();

  const { connect, connectors, isLoading } = useConnect();
  const { refetch: refetchWalletClient } = useWalletClient();
  const { address, isConnected } = useAccount({ onConnect: onWalletConnected });
  const { disconnect } = useDisconnect();

  const loading = ref(false);

  onMounted(() => {
    if (!authStore.user.evmWallet) {
      disconnect();
    }
  });

  async function onWalletConnected({ address, connector, isReconnected }) {
    await sleep(200);
    loading.value = false;
    console.log(address, isReconnected, connector);
  }

  function wagmiConnect(connector) {
    if (isConnected.value) {
      refetchWalletClient();
    } else if (connector.ready) {
      connect({ connector });
    }
  }
  async function connectWallet() {
    await sleep(200);
    loading.value = true;

    if (!isConnected.value) {
      wagmiConnect(connectors.value[0]);
      loading.value = false;
      return;
    }

    const sign = await connectAndSign();
    if (!sign) {
      loading.value = false;
      return;
    }

    loading.value = false;
  }

  function disconnectWallet() {
    disconnect();
  }

  return {
    loading,
    connectWallet,
    disconnectWallet,
  };
}
