<template>
  <Btn v-bind="$attrs" type="secondary" @click.native="walletConnect()">
    {{ $t('login.wallet') }}
  </Btn>
</template>

<script lang="ts" setup>
import { createDiscreteApi } from 'naive-ui';
import { useProvider } from '~~/composables/useProvider';
import useContracts from '~~/composables/useContracts';

const authStore = useAuthStore();
const $i18n = useI18n();
const router = useRouter();
const { userAccount, selectProvider } = useProvider();
const { getMessageSignature } = useContracts();
const { isWalletPluginReady, connectToAccount } = useWalletAccounts();
const { message } = createDiscreteApi(['message'], MessageProviderOptoins);

const loading = ref(false);

async function walletConnect(connector = ProviderConnectors.METAMASK) {
  if (loading.value) {
    return;
  }
  loading.value = true;

  if (await selectProvider(connector)) {
    await connectToAccount(connector === ProviderConnectors.METAMASK && authStore.allowedEntry);
    if (!isWalletPluginReady.value) {
      loading.value = false;
      return;
    }
  }

  try {
    const res = await $api.get<WalletResponse>(endpoints.walletMsg);

    const timestamp = res.data.timestamp;
    if (!!res.data.message && !!res.data.timestamp) {
      const signature = await getMessageSignature(res.data.message);

      console.debug('signature', userAccount.value);

      if (signature) {
        const res = await $api.post<WalletLoginResponse>(endpoints.loginWallet, {
          wallet: userAccount.value,
          signature,
          timestamp,
        });

        const { authToken } = res.data;
        if (authToken) {
          await authStore.setUserToken(authToken);
          router.push({ name: 'profile' });
        }
      } else {
        message.error($i18n.t('error.walletSignature'));
      }
    }
  } catch (e) {
    message.error($i18n.t('error.walletSignature'));
  }

  loading.value = false;
}
</script>
