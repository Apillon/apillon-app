<template>
  <Btn v-bind="$attrs" type="secondary" @click.native="walletConnect()">
    {{ $t('login.wallet') }}
  </Btn>
</template>

<script lang="ts" setup>
import { createDiscreteApi } from 'naive-ui';
import { useI18n } from 'vue-i18n';
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
    const res = await $api.get<WalletResponse>(endpoints.walletMsg, null);

    if (res.error) {
      message.error(userFriendlyMsg($i18n, res.error));
      loading.value = false;
      return;
    }

    const timestamp = res.data.timestamp;
    if (!!res.data.message && !!res.data.timestamp) {
      const signature = await getMessageSignature(res.data.message);

      console.debug('signature', userAccount.value);

      if (signature) {
        const res = await $api.post<{ authToken }>(endpoints.loginWallet, {
          wallet: userAccount.value,
          signature,
          timestamp,
        });

        if (res.error) {
          message.error(userFriendlyMsg($i18n, res.error));
          loading.value = false;
          return;
        }
        const { authToken } = res.data;
        if (authToken && authToken.data) {
          await authStore.setUserToken(authToken.data);
          router.push({ name: 'profile' });
        }
      } else {
        message.error($i18n.t('error.walletSignature'));
      }
    }
  } catch (e) {
    message.error($i18n.t('error.walletSignature'));
    console.error(e);
  }

  loading.value = false;
}
</script>
