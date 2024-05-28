<template>
  <template v-if="hasClaimed">
    <h1>You've successfully claimed your $NCTR</h1>
  </template>
  <template v-else-if="!hasClaimed && referralStore.tokenClaim.wallet">
    <Btn
      type="primary"
      size="large"
      class="mt-2"
      :loading="loading"
      :disabled="isDisabled"
      @click="claimNctr"
    >
      {{ $t('referral.info.claim.claim') }}
    </Btn>
  </template>
  <template v-else-if="!referralStore.tokenClaim.wallet">
    <h1>You need to connect a wallet</h1>
  </template>
</template>

<script setup lang="ts">
import { useAccount, useConnect, useWalletClient } from 'use-wagmi';

const { connectAndSign } = useWallet();
const { connect, connectors } = useConnect();
const { refetch: refetchWalletClient } = useWalletClient();
const { isConnected } = useAccount({ onConnect: onWalletConnected });
const referralStore = useReferralStore();

const { initContract, getClaimStatus, claimTokens } = useContract();

const loading = ref<boolean>(true);
const hasClaimed = ref(false);

const isDisabled = computed(() => !referralStore.tokenClaim.wallet || !hasClaimed);

onMounted(async () => {
  await initContract();
  hasClaimed.value = await getClaimStatus();
  loading.value = false;
});

async function claimNctr(e: MouseEvent | null) {
  e?.preventDefault();
  loading.value = true;
  try {
    if (!isConnected.value) {
      await wagmiConnect(connectors.value[0]);
    }

    const sign = await connectAndSign();
    if (!sign) {
      loading.value = false;
      return;
    }

    // TODO: ADD A DAMJAN WALLET CHECK
    const { signature, timestamp, amount } = await getNctrClaimParams;
    if (!signature || !timestamp || !amount) {
      throw new Error('Invalid claim parameters');
    }

    hasClaimed.value = await claimTokens(signature, timestamp, amount);
    // console.log(hasClaimed.value);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

async function getNctrClaimParams() {
  try {
    const res = await $api.get<NctrclaimInterface>(endpoints.referralClaimParams);
    if (!res.signature || !res.timestamp || !res.amount) {
      throw new Error('Incomplete response data');
    }
    return res;
  } catch (error) {
    console.error('Error fetching request params:', error);
    return {};
  }
}

function wagmiConnect(connector) {
  if (isConnected.value) {
    refetchWalletClient();
  } else if (connector.ready) {
    connect({ connector });
  }
}

async function onWalletConnected() {
  await sleep(200);
  if (loading.value) {
    // TODO: should we get initial params here ?
    console.log('wallet connected');
  }
}
</script>
