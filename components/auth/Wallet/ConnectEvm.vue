<template>
  <div class="my-8">
    <n-h5 v-if="authStore.user.evmWallet" class="mb-0"
      >{{ $t('auth.wallet.evm.connected') }}
      <span class="mr-2 text-xs">({{ truncateWallet(authStore.user.evmWallet) }})</span>
    </n-h5>
    <n-h5 v-else class="mb-0">{{ $t('auth.wallet.evm.connect') }}</n-h5>

    <p class="mb-6 text-body">{{ $t('auth.wallet.evm.info') }}</p>

    <div v-if="authStore.user.evmWallet" class="flex gap-4">
      <Btn class="flex-1" type="secondary" @click="connectDifferent">
        {{ $t('auth.wallet.connect.different') }}
      </Btn>
      <Btn class="flex-1" type="error" :loading="loadingRemove" borderless @click="removeWallet()">
        {{ $t('auth.wallet.evm.disconnect') }}
      </Btn>
    </div>
    <Btn
      v-else
      size="large"
      type="secondary"
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
    <AuthWalletEvm :loading="loading" />
  </modal>
</template>

<script lang="ts" setup>
import { useAccount, useConnect, useDisconnect, useWalletClient } from 'use-wagmi';

const { t } = useI18n();
const authStore = useAuthStore();
const { error, success } = useMessage();
const { connectAndSign } = useWallet();

const { connect, connectors, isLoading } = useConnect();
const { refetch: refetchWalletClient } = useWalletClient();
const { address, isConnected } = useAccount({ onConnect: onWalletConnected });
const { disconnect } = useDisconnect();

const loading = ref<boolean>(false);
const loadingRemove = ref<boolean>(false);
const modalWalletVisible = ref<boolean>(false);

onMounted(() => {
  if (!authStore.user.evmWallet) {
    disconnect();
  }
});

function wagmiConnect(connector) {
  if (isConnected.value) {
    refetchWalletClient();
  } else if (connector.ready) {
    connect({ connector });
  }
}

async function onWalletConnected({ address, connector, isReconnected }) {
  await sleep(200);
  if (authStore.user.evmWallet !== address) {
    connectWallet();
  }
}

async function connectDifferent() {
  disconnect();
  await sleep(200);
  refetchWalletClient();
  modalWalletVisible.value = true;
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

  try {
    const { signature, timestamp } = sign;
    const res = await $api.post<WalletLoginResponse>(endpoints.walletConnect, {
      wallet: address.value,
      signature,
      timestamp,
      isEvmWallet: true,
    });

    authStore.saveUser(res.data);

    success(t('auth.wallet.connected.success'));

    modalWalletVisible.value = false;
  } catch (e) {
    /** Show error message */
    error(userFriendlyMsg(e));
  }
  loading.value = false;
}

async function removeWallet() {
  loadingRemove.value = true;
  try {
    const res = await $api.post<WalletLoginResponse>(endpoints.walletConnect, {
      wallet: null,
      isEvmWallet: true,
    });

    authStore.saveUser(res.data);

    disconnect();
    success(t('auth.wallet.disconnect.success'));
  } catch (e) {
    /** Show error message */
    error(userFriendlyMsg(e));
  }
  loadingRemove.value = false;
}
</script>
