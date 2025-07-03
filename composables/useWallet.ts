import { useAccount, useConnect, useConnectorClient, type Config } from '@wagmi/vue';
import { signMessage } from '@wagmi/vue/actions';

export default function useWallet() {
  const { t } = useI18n();
  const { error } = useMessage();
  const authStore = useAuthStore();

  /** Evm wallet - wagmi */
  const { $wagmiConfig } = useNuxtApp();
  const { data: walletClient, refetch } = useConnectorClient();
  const { address, connector } = useAccount();
  const { connectAsync } = useConnect();

  async function connectAndSign() {
    await sleep(200);

    await refetch();

    if (!walletClient.value) {
      error(t('auth.wallet.login.walletNotConnected'));
      return;
    }

    if (!address.value) {
      error(t('auth.wallet.login.walletAccountNotConnected'));
      return;
    }

    try {
      const { message, timestamp } = await authStore.getAuthMsg();
      const signature = await signMessage($wagmiConfig as Config, { message });

      await sleep(200);

      if (!connector.value) {
        error(t('auth.wallet.login.walletNotConnected2'));
        return;
      } else if (!address.value) {
        await connectAsync({ connector: connector.value });
      }
      await sleep(200);

      return { signature, timestamp };
    } catch (e) {
      console.warn(e);
    }
  }

  return {
    connectAndSign,
  };
}
