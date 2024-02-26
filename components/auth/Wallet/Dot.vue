<template>
  <n-space class="my-8" :size="24" vertical>
    <template v-for="(wallet, key) in wallets">
      <div v-if="isWalletAvailable(wallet)" :key="key">
        <div
          class="card flex items-center px-4 py-3"
          :class="{ 'cursor-pointer': wallet.installed }"
          @click="onSelect(wallet)"
        >
          <NuxtIcon v-if="wallet.icon" :name="wallet.icon" class="text-xl mr-2" filled />
          <Image
            v-else-if="wallet.image"
            :src="wallet.image"
            :alt="wallet.extensionName"
            class="mr-2"
            width="20"
            height="20"
          />
          <div v-else class="w-5 h-5 mr-2"></div>

          <div class="flex-1">
            {{ wallet.title }}
          </div>
          <div class="wallet-install">
            <Btn
              v-if="!wallet.installed"
              class="inline-block"
              type="link"
              :href="getWalletInstallUrl(wallet.installUrl)"
              target="_blank"
            >
              {{ $t('general.install') }}
            </Btn>
          </div>
        </div>
        <div
          v-if="isWalletAvailable(wallet) && wallet.extensionName === authStore.wallet.name"
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
                <tr
                  v-for="(account, accountKey) in authStore.wallet.accounts"
                  :key="accountKey"
                  :class="{ hidden: account.type === 'ethereum' }"
                >
                  <td class="whitespace-nowrap">{{ account.name }}</td>
                  <td>
                    <TableEllipsis :text="account.address" />
                  </td>
                  <td>
                    <Btn
                      v-if="authStore.user.wallet === account.address"
                      type="error"
                      :loading="loading && selectedAddress === account.address"
                      @click="emit('remove', account)"
                    >
                      <span class="whitespace-nowrap">
                        {{ $t('auth.wallet.disconnect.wallet') }}
                      </span>
                    </Btn>
                    <Btn
                      v-else
                      type="secondary"
                      :loading="loading && selectedAddress === account.address"
                      @click="connectAccount(account)"
                    >
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
    </template>
  </n-space>
</template>

<script lang="ts" setup>
defineProps({
  actionText: { type: String, default: '' },
  loading: { type: Boolean, default: false },
});
const emit = defineEmits(['sign', 'remove']);

const { isLg } = useScreen();
const authStore = useAuthStore();
const wallets = ref<Wallet[]>([]);
const selectedAddress = ref<string>('');

onMounted(() => {
  wallets.value = getWallets();
});

function onSelect(wallet: Wallet) {
  if (wallet.installed) {
    authStore.setWallet(wallet);
  }
}
function connectAccount(account: WalletAccount) {
  selectedAddress.value = account.address;
  emit('sign', account);
}

/** Wallet is available if is large screen and wallet type is desktop or is small screen and wallet type is mobile */
function isWalletAvailable(wallet: WalletInfo) {
  return (isLg.value && wallet.type === 'desktop') || (!isLg.value && wallet.type === 'mobile');
}

/** Get url by browser or by device, if this install url does not exists, use default value */
function getWalletInstallUrl(urls: Record<string, string>) {
  if (isLg.value) {
    const bn = getBrowserName();
    return bn in urls ? urls[bn] : urls.default;
  }
  const dn = getDeviceName();
  return dn in urls ? urls[dn] : urls.default;
}
</script>
