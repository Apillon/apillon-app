<template>
  <div class="my-8">
    <n-h5 class="mb-0">{{ $t('auth.wallet.evm.connect') }}</n-h5>
    <p class="mb-6 text-body">{{ $t('auth.wallet.evm.info') }}</p>

    <Btn
      v-if="isConnected && authStore.user.evmWallet"
      v-bind="$attrs"
      :size="size"
      :loading="loading || isLoading"
      borderless
      @click="disconnectWallet()"
    >
      {{ $t('auth.wallet.evm.disconnect') }}
      (<span v-if="address" class="mr-2 text-xs"> {{ truncateWallet(address) }} </span>)
    </Btn>
    <Btn
      v-else
      v-bind="$attrs"
      type="secondary"
      :size="size"
      :loading="loading || isLoading"
      borderless
      @click="modalWalletVisible = true"
    >
      {{ $t('auth.wallet.evm.connect') }}
    </Btn>
  </div>

  <modal v-model:show="modalWalletVisible" :title="$t('auth.wallet.evm.title')">
    <p class="mb-8">
      {{ $t('auth.wallet.evm.info') }}
    </p>
    <AuthWalletEvm />
  </modal>
</template>

<script lang="ts" setup>
import type { Size } from 'naive-ui/es/button/src/interface';
import { useAccount, useConnect, useDisconnect, useWalletClient } from 'use-wagmi';

defineProps({
  size: { type: String as PropType<Size>, default: 'large' },
});

const { t } = useI18n();
const authStore = useAuthStore();
const { error, success } = useMessage();

const { connect, connectors, isLoading } = useConnect();
const { data: walletClient, refetch: refetchWalletClient } = useWalletClient();
const { address, connector, isConnected } = useAccount({ onConnect: connectWallet });
const { disconnect } = useDisconnect();

const loading = ref<boolean>(false);
const modalWalletVisible = ref<boolean>(false);

onMounted(() => {
  if (!authStore.user.evmWallet) {
    disconnect();
  }
});

async function connectWallet() {
  await sleep(200);
  loading.value = true;

  if (!walletClient.value) {
    await refetchWalletClient();

    if (!walletClient.value) {
      error(t('auth.wallet.login.walletNotConnected'));
      loading.value = false;
      return;
    }
  }

  if (!address.value) {
    error(t('auth.wallet.login.walletAccountNotConnected'));
    loading.value = false;
    return;
  }

  try {
    const { message, timestamp } = await authStore.getAuthMsg();
    const signature = await walletClient.value.signMessage({ message });

    await sleep(200);

    if (!connector.value) {
      error(t('auth.wallet.login.walletNotConnected2'));
      loading.value = false;
      return;
    } else if (!address.value) {
      await connectAsync({ connector: connector.value });
    }

    await sleep(200);

    const res = await $api.post<WalletLoginResponse>(endpoints.walletConnect, {
      wallet: address.value,
      signature,
      timestamp,
    });

    authStore.saveUser(res.data);

    /** Show success message */
    success(t('auth.wallet.connected.success'));
  } catch (e) {
    /** Show error message */
    error(userFriendlyMsg(e));
  }
  loading.value = false;
}

async function disconnectWallet() {
  try {
    const { message, timestamp } = await authStore.getAuthMsg();
    const signature = await walletClient.value.signMessage({ message });

    await sleep(200);

    if (!connector.value) {
      error(t('auth.wallet.login.walletNotConnected2'));
      loading.value = false;
      return;
    } else if (!address.value) {
      await connectAsync({ connector: connector.value });
    }

    await sleep(200);

    const res = await $api.post<WalletLoginResponse>(endpoints.walletConnect, {
      wallet: '',
      signature,
      timestamp,
    });

    authStore.saveUser(res.data);
    disconnect();

    /** Show success message */
    success(t('auth.wallet.disconnected.success'));
  } catch (e) {
    /** Show error message */
    error(userFriendlyMsg(e));
  }
}
</script>
