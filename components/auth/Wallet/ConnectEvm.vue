<template>
  <div class="my-6">
    <Btn
      v-if="isConnected"
      v-bind="$attrs"
      :size="size"
      :loading="loading || isLoading"
      borderless
      @click="disconnect()"
    >
      {{ $t('auth.wallet.evm.disconnect') }}
      (<span v-if="address" class="mr-2 text-xs">
        {{ truncateWallet(address) }} </span
      >)
    </Btn>
    <Btn
      v-else
      v-bind="$attrs"
      :size="size"
      :loading="loading || isLoading"
      borderless
      @click="modalWalletVisible = true"
    >
      {{ $t('auth.wallet.evm.connect') }}
    </Btn>
  </div>

  <modal v-model:show="modalWalletVisible">
    <AuthWalletEvm />
  </modal>
</template>

<script lang="ts" setup>
import type { Size } from 'naive-ui/es/button/src/interface';
import { useAccount, useConnect, useDisconnect, useWalletClient } from 'use-wagmi';
import { sleep } from '~/lib/helpers';

defineProps({
  size: { type: String as PropType<Size>, default: 'large' },
});

const { error } = useMessage();

const { connect, connectors, isLoading } = useConnect();
const { data: walletClient, refetch } = useWalletClient();
const { address, isConnected } = useAccount({ onConnect: login });
const { disconnect } = useDisconnect();

const loading = ref<boolean>(false);
const modalWalletVisible = ref<boolean>(false);

async function login() {
  await sleep(100);

  loading.value = true;
  try {
    if (!isConnected.value) {
      await connect({ connector: connectors.value[0] });
      modalWalletVisible.value = false;
    } else {
      await refetch();

      if (!walletClient.value) {
        await connect({ connector: connectors.value[0] });

        if (!walletClient.value) {
          error('Could not connect with wallet');
          loading.value = false;
          return;
        }
      }

      modalWalletVisible.value = false;
    }
  } catch (e) {
    console.log(e);
  }
  loading.value = false;
}
</script>
