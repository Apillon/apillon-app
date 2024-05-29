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
    <h1>The NCTR Airdrop is now finished.</h1>
  </template>
</template>

<script setup lang="ts">
import { useAccount, useConnect, useWalletClient } from 'use-wagmi';

const { connectAndSign } = useWallet();
const { connect, connectors } = useConnect();
const { refetch: refetchWalletClient } = useWalletClient();
const { isConnected } = useAccount({ onConnect: onWalletConnected });
const referralStore = useReferralStore();

const { initContract, getClaimStatus, claimTokens, ensureCorrectNetwork } = useContract();

const loading = ref<boolean>(true);
const hasClaimed = ref(false);

const isDisabled = computed(() => !referralStore.tokenClaim.wallet || !hasClaimed);

onMounted(async () => {
  if (!isConnected.value) {
    await wagmiConnect(connectors.value[0]);
  }
  await initContract();
  hasClaimed.value = await getClaimStatus();
  loading.value = false;
});

// Claim
async function claimNctr(e: MouseEvent | null) {
  e?.preventDefault();
  loading.value = true;
  try {
    // Verify wallet connection
    if (!isConnected.value) {
      await wagmiConnect(connectors.value[0]);
    }
    // Verify network before continuing the transaction
    await ensureCorrectNetwork();
    // Sign
    const sign = await connectAndSign();
    if (!sign) {
      loading.value = false;
      return;
    }
    // Call BE for correct params
    const { signature, timestamp, amount } = await getNctrClaimParams();
    if (!signature || !timestamp || !amount) {
      throw new Error('Invalid claim parameters');
    }
    // Final claim on contract
    hasClaimed.value = await claimTokens(signature, timestamp, amount);
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
    loading.value = false;
  }
}
</script>
