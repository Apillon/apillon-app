<template>
  <div class="my-8">
    <h5 v-if="!!authStore.user?.wallet" class="mb-0">
      {{ $t('auth.wallet.connected.title') }}
      <span class="mr-2 text-xs">({{ truncateWallet(authStore.user.wallet) }})</span>
    </h5>
    <n-h5 v-else class="mb-0">{{ $t('auth.wallet.connect.title') }}</n-h5>

    <p class="mb-6 text-body">{{ $t('auth.wallet.connected.info') }}</p>

    <div v-if="!!authStore.user?.wallet" class="w-full flex gap-4">
      <Btn class="flex-1" type="secondary" @click="modalWalletSelectVisible = true">
        {{ $t('auth.wallet.connect.different') }}
      </Btn>
      <Btn class="flex-1" type="error" borderless @click="removeWallet()">
        {{ $t('auth.wallet.disconnect.wallet') }}
      </Btn>
    </div>
    <Btn v-else size="large" type="secondary" @click="modalWalletSelectVisible = true">
      {{ $t('auth.wallet.connect.btn') }}
    </Btn>
  </div>

  <!-- Modal - Wallet select -->
  <modal v-model:show="modalWalletSelectVisible" :title="$t('auth.wallet.connect.title')">
    <AuthWalletDot
      :action-text="$t('auth.wallet.connect.btn')"
      :loading="loadingWallet"
      @sign="walletConnect"
      @remove="removeWallet"
    />
  </modal>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const { error, success } = useMessage();
const authStore = useAuthStore();
const { getMessageSignature } = useProvider();

const loadingRemove = ref<boolean>(false);
const loadingWallet = ref<boolean>(false);
const modalWalletSelectVisible = ref<boolean>(false);

/** Wallet connect */
async function walletConnect(account: WalletAccount) {
  loadingWallet.value = true;

  try {
    const { message, timestamp } = await authStore.getAuthMsg();
    const signature = await getMessageSignature(account.address, message);

    const res = await $api.post<WalletLoginResponse>(endpoints.walletConnect, {
      wallet: account.address,
      signature,
      timestamp,
      isEvmWallet: false,
    });

    authStore.saveUser(res.data);

    /** Show success message */
    success(t('auth.wallet.connected.success'));
  } catch (e) {
    /** Show error message */
    error(userFriendlyMsg(e));
  }
  modalWalletSelectVisible.value = false;
  loadingWallet.value = false;
}

async function removeWallet(account?: WalletAccount) {
  if (!account && authStore.wallet.address) {
    account = authStore.wallet.accounts.find(item => item.address === authStore.wallet.address);
  }
  if (!account) {
    modalWalletSelectVisible.value = true;
    return;
  }

  loadingRemove.value = true;
  try {
    const res = await $api.post<WalletLoginResponse>(endpoints.walletConnect, {
      wallet: null,
      isEvmWallet: false,
    });

    authStore.saveUser(res.data);

    success(t('auth.wallet.disconnect.success'));
  } catch (e) {
    /** Show error message */
    error(userFriendlyMsg(e));
  }
  modalWalletSelectVisible.value = false;
  loadingWallet.value = false;
}
</script>
