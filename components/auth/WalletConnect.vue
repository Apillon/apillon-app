<template>
  <Btn v-bind="$attrs" type="secondary" @click.native="walletConnect()">
    {{ $t('login.wallet') }}
  </Btn>
</template>

<script lang="ts" setup>
const authStore = useAuthStore();
const router = useRouter();
const { $alert } = useAlerts();
const { userAccount, selectProvider } = useProvider();
const { getMessageSignature } = useContracts();
const { isWalletPluginReady, connectToAccount } = useWalletAccounts();

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
    const res = await $api.get<{ message: string; timestamp: number }>(endpoints.walletMsg, null);

    if (res.error) {
      $alert.error({
        title: res.error.message,
      });
      loading.value = false;
      return;
    }

    const { message, timestamp } = res.data;
    if (!!message && !!timestamp) {
      const signature = await getMessageSignature(message);

      console.debug('signature', userAccount.value);

      if (signature) {
        const res = await $api.post<{ authToken }>(endpoints.loginWallet, {
          wallet: userAccount.value,
          signature,
          timestamp,
        });

        if (res.error) {
          $alert.error({
            title: res.error.message,
          });
          loading.value = false;
          return;
        }
        const { authToken } = res.data;
        if (authToken && authToken.data) {
          await authStore.setUserToken(authToken.data);
          router.push({ name: 'profile' });
        }
      } else {
        $alert.error({
          title: 'Could not capture your signature, check your wallet connection',
        });
      }
    }
  } catch (e) {
    $alert.error({
      title: 'Could not capture your signature, check your wallet connection',
    });
    console.error(e);
  }

  loading.value = false;
}
</script>
