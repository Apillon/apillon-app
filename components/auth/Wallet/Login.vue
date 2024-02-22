<template>
  <Btn v-bind="$attrs" type="info" :color="colors.blue" @click="modalWalletSelectVisible = true">
    <span class="icon-wallet text-xl align-sub mr-2"></span>
    <span>{{ $t('auth.login.wallet') }}</span>
  </Btn>
  <!-- Modal - Wallet select -->
  <modal v-model:show="modalWalletSelectVisible" :title="$t('auth.wallet.connect.title')">
    <h6 class="flex-cc mb-6">
      {{ $t('auth.wallet.connect.polkadot') }}
    </h6>
    <AuthWalletDot
      :action-text="$t('auth.wallet.login.title')"
      :loading="loadingWallet"
      @sign="walletLogin"
    />

    <h6 class="flex-cc mb-6">
      {{ $t('auth.wallet.evm.connect') }}
    </h6>
    <AuthWalletEvm :loading="loadingWallet" />
  </modal>
</template>

<script lang="ts" setup>
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchNetwork,
  useNetwork,
  useWalletClient,
} from 'use-wagmi';
import colors from '~/tailwind.colors';

const { t } = useI18n();
const { error, success } = useMessage();
const router = useRouter();
const authStore = useAuthStore();
const dataStore = useDataStore();
const { getMessageSignature } = useProvider();

/** Evm wallet - wagmi */
const { connectAsync } = useConnect();
const { disconnect } = useDisconnect();
const { data: walletClient, refetch: refetchWalletClient } = useWalletClient();
const { address, connector } = useAccount({
  onConnect: evmWalletLogin,
});

const loadingWallet = ref<boolean>(false);
const modalWalletSelectVisible = ref<boolean>(false);

onMounted(() => {
  disconnect();
});

/** Wallet login */
async function walletLogin(account: WalletAccount) {
  loadingWallet.value = true;

  try {
    const { message, timestamp } = await authStore.getAuthMsg();

    const signature = await getMessageSignature(account.address, message);

    authStore.wallet.signature = signature;
    authStore.wallet.timestamp = timestamp;

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
  loadingWallet.value = true;

  if (!walletClient.value) {
    await refetchWalletClient();

    if (!walletClient.value) {
      error(t('auth.wallet.login.walletNotConnected'));
      loadingWallet.value = false;
      return;
    }
  }

  if (!address.value) {
    error(t('auth.wallet.login.walletAccountNotConnected'));
    loadingWallet.value = false;
    return;
  }

  try {
    const { message, timestamp } = await authStore.getAuthMsg();

    const signature = await walletClient.value.signMessage({ message });

    authStore.wallet.signature = signature;
    authStore.wallet.timestamp = timestamp;

    await sleep(200);

    if (!connector.value) {
      error(t('auth.wallet.login.walletNotConnected2'));
      loadingWallet.value = false;
      return;
    } else if (!address.value) {
      await connectAsync({ connector: connector.value });
    }

    await sleep(200);

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
