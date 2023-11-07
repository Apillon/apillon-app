<template>
  <Btn v-bind="$attrs" type="info" :color="colors.blue" @click="modalWalletSelectVisible = true">
    <span class="icon-wallet text-xl align-sub mr-2"></span>
    <span>{{ $t('auth.login.wallet') }}</span>
  </Btn>
  <!-- Modal - Wallet select -->
  <modal v-model:show="modalWalletSelectVisible" :title="$t('auth.wallet.connect.title')">
    <AuthWalletSelect
      :action-text="$t('auth.wallet.login')"
      :loading="loadingWallet"
      @sign="walletLogin"
    />
  </modal>
</template>

<script lang="ts" setup>
import colors from '~~/tailwind.colors';

const message = useMessage();
const authStore = useAuthStore();
const dataStore = useDataStore();
const { getMessageSignature } = useProvider();

const loadingWallet = ref<boolean>(false);
const modalWalletSelectVisible = ref<boolean>(false);

/** Wallet connect */
async function walletLogin(account: WalletAccount) {
  loadingWallet.value = true;

  const authMsg = await authStore.getAuthMsg();

  if (!!authMsg.message && !!authMsg.timestamp) {
    // Get user's signature
    const signature = await getMessageSignature(account.address, authMsg.message);

    if (signature) {
      /** Get api user for wallet address */
      try {
        const res = await $api.post<WalletLoginResponse>(endpoints.walletLogin, {
          wallet: account.address,
          signature,
          timestamp: authMsg.timestamp,
        });

        authStore.saveUser(res.data);

        /** Fetch projects, if user hasn't any project redirect him to '/onboarding/first' so he will be able to create first project */
        await dataStore.fetchProjects(true);
      } catch (error) {
        /** Show error message */
        message.error(userFriendlyMsg(error));
      }
    }
  }
  loadingWallet.value = false;
}
</script>
