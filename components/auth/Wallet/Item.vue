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
    <div v-if="wallet.extensionName === authStore.wallet.key">
      <div v-for="(account, key) in authStore.accounts" :key="key" class="flex justify-between">
        <div>
          <div>
            <strong>Name:</strong><br />
            <span>{{ account.name }}</span>
          </div>
          <div>
            <strong>Address:</strong><br />
            <span>{{ account.address }}</span>
          </div>
        </div>
        <div class="whitespace-nowrap">
          <Btn type="secondary" @click="onSignClicked(account)">
            <span class="whitespace-nowrap"> Sign Dummy </span>
          </Btn>
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
  const signer = authStore.wallet.provider?.signer;

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
