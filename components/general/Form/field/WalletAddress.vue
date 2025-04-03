<template>
  <div class="flex w-full items-center gap-4">
    <n-input v-bind="$attrs" :placeholder="$t('general.typeHere')" clearable />
    <Btn v-if="!isConnected" type="secondary" @click="modalWalletVisible = true">
      {{ $t('auth.wallet.connect.wallet') }}
    </Btn>
    <Btn v-else type="secondary" @click="connectDifferent">
      {{ $t('auth.wallet.connect.different') }}
    </Btn>
  </div>

  <!-- Modal wallet connect -->
  <modal v-model:show="modalWalletVisible" :title="$t('auth.wallet.evm.title')">
    <LazyAuthWalletEvm @connected="onConnected" />
  </modal>
</template>

<script lang="ts" setup>
import { useAccount, useDisconnect, useConnectorClient } from '@wagmi/vue';

const emit = defineEmits(['connected']);
const authStore = useAuthStore();
const { address, isConnected } = useAccount();
const { refetch: refetchWalletClient } = useConnectorClient();
const { disconnect } = useDisconnect();

const modalWalletVisible = ref<boolean>(false);

onMounted(() => {
  if (address.value) {
    emit('connected', address.value);
  } else if (authStore.user.evmWallet) {
    emit('connected', authStore.user.evmWallet);
  }
});

function onConnected(address: string) {
  modalWalletVisible.value = false;
  emit('connected', address);
}

async function connectDifferent() {
  emit('connected', '');
  disconnect();
  await sleep(200);
  refetchWalletClient();
  modalWalletVisible.value = true;
}
</script>
