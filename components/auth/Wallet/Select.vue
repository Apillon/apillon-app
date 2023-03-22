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
            {{ $t('general.install') }}
          </Btn>
        </div>
      </div>
      <div
        v-if="wallet.extensionName === authStore.wallet.type"
        class="overflow-auto md:overflow-hidden"
      >
        <transition name="slide-down" appear>
          <n-table
            v-if="authStore.wallet.accounts && authStore.wallet.accounts.length > 0"
            class="text-left"
          >
            <thead>
              <tr>
                <th>{{ $t('general.name') }}:</th>
                <th>{{ $t('general.address') }}:</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr v-for="(account, accountKey) in authStore.wallet.accounts" :key="accountKey">
                <td class="whitespace-nowrap">{{ account.name }}</td>
                <td>
                  <TableEllipsis :text="account.address" />
                </td>
                <td>
                  <Btn type="secondary" :loading="loading" @click="emit('sign', account)">
                    <span v-if="actionText" class="whitespace-nowrap"> {{ actionText }} </span>
                    <span v-else class="whitespace-nowrap">
                      {{ $t('auth.wallet.connect.title') }}
                    </span>
                  </Btn>
                </td>
              </tr>
            </tbody>
          </n-table>
          <div v-else class="p-4 text-center">
            <h5>{{ $t('auth.wallet.createAccount') }}</h5>
          </div>
        </transition>
      </div>
    </div>
  </n-space>
</template>

<script lang="ts" setup>
defineProps({
  actionText: { type: String, default: '' },
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
