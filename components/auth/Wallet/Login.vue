<template>
  <Btn v-bind="$attrs" type="secondary" @click="modalWalletSelectVisible = true">
    <span class="icon-wallet mr-2 align-sub text-xl"></span>
    <span v-if="register" class="text-white">{{ $t('auth.signup.wallet') }}</span>
    <span v-else class="text-white">{{ $t('auth.login.wallet') }}</span>
  </Btn>
  <!-- Modal - Wallet select -->
  <modal v-model:show="modalWalletSelectVisible" :title="$t('auth.wallet.connect.title')">
    <h6 class="flex-cc mb-6">
      {{ $t('auth.wallet.connect.polkadot') }}
    </h6>
    <AuthWalletDot :action-text="$t('auth.wallet.login.title')" :loading="loadingWallet" @sign="walletLogin" />

    <h6 class="flex-cc mb-6">
      {{ $t('auth.wallet.evm.connect') }}
    </h6>
    <AuthWalletEvm :loading="loadingWallet" />
  </modal>
</template>

<script lang="ts" setup>
import { useAccount, useDisconnect, useAccountEffect } from '@wagmi/vue';
import { colors } from '~/tailwind.config';

const props = defineProps({
  register: { type: Boolean, default: false },
});
const emit = defineEmits(['register']);

const { t } = useI18n();
const { error, success } = useMessage();
const router = useRouter();
const authStore = useAuthStore();
const dataStore = useDataStore();
const { connectAndSign } = useWallet();
const { getMessageSignature } = useProvider();
const { clearAll } = useStore();

/** Evm wallet - wagmi */
const { disconnect } = useDisconnect();
const { address } = useAccount();
useAccountEffect({ onConnect: evmWalletLogin });

const loadingWallet = ref<boolean>(false);
const modalWalletSelectVisible = ref<boolean>(false);

onBeforeMount(() => {
  disconnect();
});

/** Wallet login */
async function walletLogin(account: WalletAccount) {
  loadingWallet.value = true;

  // Logout first - delete LS and store if there is any data
  authStore.logout();
  dataStore.resetCurrentProject();

  /** Clear all stored data */
  clearAll();

  try {
    const { message, timestamp } = await authStore.getAuthMsg();

    const signature = await getMessageSignature(account.address, message);

    authStore.wallet.signature = signature;
    authStore.wallet.timestamp = timestamp;

    if (props.register) {
      loadingWallet.value = false;
      modalWalletSelectVisible.value = false;
      emit('register');
      return;
    }

    const res = await $api.post<WalletLoginResponse>(endpoints.walletLogin, {
      wallet: account.address,
      signature,
      timestamp,
      isEvmWallet: false,
    });

    await onLoginSuccess(res.data);
  } catch (e) {
    onLoginError(e);
  }

  loadingWallet.value = false;
}

/** Login with EVM wallet */
async function evmWalletLogin() {
  await sleep(200);
  if (!address.value) return;

  loadingWallet.value = true;

  const sign = await connectAndSign();
  if (!sign || !sign.signature || !sign.timestamp) return;

  try {
    const { signature, timestamp } = sign;

    authStore.wallet.signature = signature;
    authStore.wallet.timestamp = timestamp;

    if (props.register) {
      loadingWallet.value = false;
      modalWalletSelectVisible.value = false;
      emit('register');
      return;
    }

    const res = await $api.post<WalletLoginResponse>(endpoints.walletLogin, {
      wallet: address.value,
      signature,
      timestamp,
      isEvmWallet: true,
    });

    await onLoginSuccess(res.data);
  } catch (e) {
    onLoginError(e);
  }
  loadingWallet.value = false;
}

async function onLoginSuccess(data) {
  authStore.saveUser(data);

  /** Show success message */
  success(t('auth.wallet.login.success'));

  /** Fetch projects, if user hasn't any project redirect him to '/onboarding/first' so he will be able to create first project */
  await dataStore.fetchProjects(true);
}

async function onLoginError(e) {
  if (e.code === UnauthorizedErrorCodes.USER_IS_NOT_AUTHENTICATED) {
    router.push({ name: 'register' });
  } else {
    /** Show error message */
    error(userFriendlyMsg(e));
  }
}
</script>
