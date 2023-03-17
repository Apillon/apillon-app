<template>
  <div>
    <div
      class="flex items-center p-4 bg-bg-light border-1 border-bg-lighter"
      :class="{ 'cursor-pointer': wallet.installed }"
      @click="onSelect(wallet)"
    >
      <NuxtIcon :name="wallet.icon" class="text-xl mr-2" filled />

      <div class="flex-1">
        {{ wallet.title }}
      </div>
      <div class="wallet-install">
        <Btn
          v-if="!wallet.installed"
          class="inline-block"
          type="link"
          :href="wallet.installUrl"
          target="_blank"
        >
          Install
        </Btn>
      </div>
    </div>
    <div v-if="wallet.extensionName === authStore.walletKey" class="account-list">
      <div v-for="(account, key) in authStore.accounts" :key="key" class="account-item">
        <div class="info">
          <div class="account-item-info">
            <span class="account-item__title">Name:</span>
            <span class="account-item__content">{{ account.name }}</span>
          </div>
          <div class="account-item-info">
            <span class="account-item__title">Address:</span>
            <span class="account-item__content">{{ account.address }}</span>
          </div>
        </div>
        <div class="actions">
          <Button class="sub-wallet-btn sub-wallet-sign-btn" @click="onSignClicked(account)">
            Sign Dummy
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { createDiscreteApi } from 'naive-ui';

defineProps({
  wallet: { type: Object as PropType<Wallet>, required: true },
});

const authStore = useAuthStore();
const { message } = createDiscreteApi(['message'], MessageProviderOptoins);

function onSelect(wallet: Wallet) {
  if (wallet.installed) {
    authStore.setWallet(wallet);
  }
}

function onSignClicked(account: WalletAccount) {
  const signer = authStore.wallet?.signer;

  if (signer && signer.signRaw) {
    const signPromise = signer.signRaw({
      address: account.address,
      data: 'This is dummy message',
      type: 'bytes',
    });

    message.info('Signing...');
    signPromise
      .then((rs: any) => {
        console.log(rs);
        message.success('Sign Successfully!');
      })
      .catch(error => {
        console.error(error);
        message.error('Sign Failed or Cancelled!');
      });
  }
}
</script>
