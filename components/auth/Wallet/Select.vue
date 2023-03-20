<template>
  <n-space class="my-8" :size="24" vertical>
    <div v-for="(wallet, key) in wallets" :key="key">
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
        <div
          v-for="(account, accountKey) in authStore.wallet.accounts"
          :key="accountKey"
          class="flex justify-between"
        >
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
            <Btn type="secondary" :loading="loading" @click="emit('sign', account)">
              <span v-if="btn" class="whitespace-nowrap"> {{ btn }} </span>
              <span v-else class="whitespace-nowrap"> Sign Dummy </span>
            </Btn>
          </div>
        </div>
      </div>
    </div>
  </n-space>
</template>

<script lang="ts" setup>
defineProps({
  btn: { type: String, default: '' },
  loading: { type: Boolean, default: false },
});
const emit = defineEmits(['sign']);

const authStore = useAuthStore();
const wallets = ref<Wallet[]>([]);

onMounted(() => {
  wallets.value = getWallets();
});

function onSelect(wallet: Wallet) {
  if (wallet.installed) {
    authStore.setWallet(wallet);
  }
}
</script>
