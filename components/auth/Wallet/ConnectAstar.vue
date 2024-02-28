<template>
  <div class="my-8">
    <div class="mb-4">
      <label class="inline-flex items-baseline text-xs">
        {{ $t('referral.info.astarAddress') }}
        <!-- <IconInfo class="relative top-1" size="sm" :tooltip="$t('referral.info.claim.tooltip')" /> -->
      </label>
      <n-input
        v-model:value="authStore.user.evmWallet"
        class="bg-bg-dark"
        :placeholder="$t('referral.info.connectWallet')"
        readonly
      />
    </div>

    <Btn v-if="authStore.user.evmWallet" size="large" type="secondary" @click="connectDifferent">
      {{ $t('auth.wallet.connect.different') }}
    </Btn>
    <Btn
      v-else
      size="large"
      type="secondary"
      :loading="loading || isLoading"
      borderless
      @click="modalWalletVisible = true"
    >
      {{ $t('referral.info.connectWallet') }}
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
</script>
