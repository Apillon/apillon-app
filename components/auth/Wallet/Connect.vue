<template>
  <template v-if="isLg && isFeatureEnabled(Feature.WALLET_LOGIN, authStore.getUserRoles())">
    <!-- Wallet is connected -->
    <template v-if="!!authStore.user?.wallet">
      <h5 class="mb-0">{{ $t('auth.wallet.connected.title') }}</h5>
      <p class="mb-6">{{ $t('auth.wallet.connected.info') }}</p>

      <!--  Wallet address -->
      <n-form-item
        class="max-w-lg pointer-events-none cursor-default"
        :label="$t('auth.wallet.address')"
      >
        <n-input
          v-model:value="authStore.user.wallet"
          class="pointer-events-none cursor-default"
          :readonly="true"
        />
      </n-form-item>
      <div class="w-full flex gap-8">
        <!-- Connect different wallet -->
        <Btn size="large" type="secondary" @click="modalWalletSelectVisible = true">
          {{ $t('auth.wallet.connect.different') }}
        </Btn>

        <!-- Disconnect wallet
        <Btn type="error" @click="modalWalletSelectVisible = true">
          {{ $t('auth.wallet.disconnect.wallet') }}
        </Btn> -->
      </div>
    </template>

    <!-- Connect your wallet -->
    <template v-else>
      <n-h5 class="mb-0" prefix="bar">{{ $t('auth.wallet.connect.title') }}</n-h5>
      <p class="mb-6">{{ $t('auth.wallet.connect.info') }}</p>
      <Btn size="large" type="secondary" @click="modalWalletSelectVisible = true">
        {{ $t('auth.wallet.connect.btn') }}
      </Btn>
    </template>
  </template>

  <!-- Modal - Wallet select -->
  <modal v-model:show="modalWalletSelectVisible" :title="$t('auth.wallet.connect.title')">
    <AuthWalletSelect
      :action-text="$t('auth.wallet.connect.btn')"
      :loading="loadingWallet"
      @sign="walletConnect"
    />
  </modal>
</template>

<script lang="ts" setup>
import { createDiscreteApi } from 'naive-ui';

const $i18n = useI18n();
const authStore = useAuthStore();
const { isLg } = useScreen();
const { getMessageSignature } = useProvider();
const { message } = createDiscreteApi(['message'], MessageProviderOptoins);

const loadingWallet = ref<boolean>(false);
const modalWalletSelectVisible = ref<boolean>(false);

/** Wallet connect */
async function walletConnect(account: WalletAccount) {
  loadingWallet.value = true;

  const authMsg = await authStore.getAuthMsg();

  if (!!authMsg.message && !!authMsg.timestamp) {
    // Get user's signature
    const signature = await getMessageSignature(account.address, authMsg.message);

    if (signature) {
      /** Get api user for wallet address */
      try {
        const res = await $api.post<WalletLoginResponse>(endpoints.walletConnect, {
          wallet: account.address,
          signature,
          timestamp: authMsg.timestamp,
        });

        authStore.saveUser(res.data);

        /** Show sussecc message */
        message.success($i18n.t('auth.wallet.connected.success'));
      } catch (error) {
        /** Show error message */
        message.error(userFriendlyMsg(error));
      }
    }
  }
  modalWalletSelectVisible.value = false;
  loadingWallet.value = false;
}
</script>
