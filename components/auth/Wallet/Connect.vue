<template>
  <template v-if="isFeatureEnabled(Feature.WALLET_LOGIN, authStore.getUserRoles())">
    <template v-if="!!authStore.user?.wallet">
      <n-h5 class="mb-0" prefix="bar">{{ $t('auth.wallet.connect') }}</n-h5>
      <p class="mb-6">{{ $t('auth.wallet.connected') }}</p>
    </template>
    <template v-else>
      <n-h5 class="mb-0" prefix="bar">{{ $t('auth.wallet.connect') }}</n-h5>
      <p class="mb-6">{{ $t('auth.wallet.connectInfo') }}</p>
      <Btn type="secondary" @click="modalWalletSelectVisible = true">
        {{ $t('auth.wallet.connect') }}
      </Btn>
    </template>
  </template>
  <!-- Modal - Wallet select -->
  <modal v-model:show="modalWalletSelectVisible" :title="$t('auth.wallet.connect')">
    <AuthWalletSelect
      :btn="$t('auth.wallet.connect')"
      :loading="loadingWallet"
      @sign="walletConnect"
    />
  </modal>
</template>

<script lang="ts" setup>
const authStore = useAuthStore();
const { getMessageSignature } = useProvider();

const loadingWallet = ref<boolean>(false);
const modalWalletSelectVisible = ref<boolean>(false);

/** Wallet connect */
async function walletConnect(account: WalletAccount) {
  loadingWallet.value = true;

  const { message, timestamp } = await authStore.getAuthMsg();

  if (!!message && !!timestamp) {
    // Get user's signature
    const signature = await getMessageSignature(account.address, message);

    if (signature) {
      /** Get api user for wallet address */
      try {
        const res = await $api.post<WalletLoginResponse>(endpoints.walletConnect, {
          wallet: account.address,
          signature,
          timestamp,
        });

        authStore.saveUser(res.data);
      } catch (error) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
    }
  }
  loadingWallet.value = false;
}
</script>
