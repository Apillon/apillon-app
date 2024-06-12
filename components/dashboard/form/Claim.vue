<template>
  <template v-if="hasClaimed">
    <span>
      You've successfully claimed your $NCTR: You can check out the transaction on
      <a
        class="underline"
        target="_blank"
        :href="`https://moonbase.moonscan.io/tx/${referralStore.tokenClaim.wallet}`"
        >Moonbase.</a
      >
    </span>
  </template>
  <!-- button -->
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
  <template v-if="claimError">
    <p class="text-pink">Something went wrong. Please try again or try later.</p>
  </template>
  <!-- Being claimed -->
  <p v-if="transactionHash && !claimSuccess">
    <span class="text-green"
      >You're $NCTR is beng claimed. You can monitor the transaction on
      <a
        class="underline"
        target="_blank"
        :href="`https://moonbase.moonscan.io/tx/${transactionHash}`"
        >Moonbase.</a
      >
    </span>
  </p>
  <!-- Claim succes -->
  <p v-if="claimSuccess && !claimError">
    <span class="text-green"
      >You're $NCTR has been claimed. You can see the transaction on
      <a
        class="underline"
        target="_blank"
        :href="`https://moonbase.moonscan.io/tx/${referralStore.tokenClaim.wallet}`"
        >Moonbase.</a
      >
    </span>
  </p>
</template>

<script setup lang="ts">
import { useAccount, useConnect, useWalletClient } from 'use-wagmi';

const { connect, connectors } = useConnect();
const { refetch: refetchWalletClient } = useWalletClient();
const { isConnected } = useAccount({ onConnect: onWalletConnected });
const referralStore = useReferralStore();

const {
  initContract,
  getClaimStatus,
  claimTokens,
  ensureCorrectNetwork,
  claimError,
  claimSuccess,
  loading,
  transactionHash,
} = useContract();

const hasClaimed = ref(false);

const isDisabled = computed(
  () => !referralStore.tokenClaim.wallet || !hasClaimed || (claimSuccess && !claimError)
);

onMounted(async () => {
  loading.value = true;
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

    // Call BE for correct params
    const { signature, timestamp, amount } = await getNctrClaimParams();
    // console.log(signature, timestamp, amount);
    if (!signature || !timestamp || !amount) {
      throw new Error('Invalid claim parameters');
    }

    // Final claim on contract
    hasClaimed.value = await claimTokens(amount, timestamp, signature);
  } catch (error) {
    console.error(error);
    loading.value = false;
  }
}

async function getNctrClaimParams(): Promise<NctrClaimParams> {
  try {
    const res = await $api.get<NctrClaimResponse>(endpoints.referralClaimParams);

    if (!res.data.signature || !res.data.timestamp || !res.data.amount) {
      throw new Error('Incomplete response data');
    }
    return res.data;
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
