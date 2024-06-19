<template>
  <!-- button -->
  <template v-if="!hasClaimed && referralStore.tokenClaim.wallet">
    <Btn
      v-if="!isConnected"
      type="primary"
      size="large"
      class="mt-2"
      :loading="loading"
      @click="connectWallet"
    >
      {{ $t('referral.info.claim.connectToClaim') }}
    </Btn>
    <Btn
      v-else-if="isConnected && wrongNetwork"
      type="primary"
      size="large"
      class="mt-2"
      :loading="loading"
      :disabled="isDisabled"
      @click="ensureCorrectNetwork"
    >
      {{ $t('referral.info.claim.switchToClaim') }}
    </Btn>
    <Btn
      v-else
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

  <!-- Airdrop finished -->
  <p v-if="!referralStore.tokenClaim.wallet" class="text-red">The NCTR Airdrop is now finished.</p>

  <!-- Being claimed -->
  <p v-if="transactionHash && !claimSuccess">
    <span class="text-green">You're $NCTR is beng claimed.</span>
    <span v-if="transactionHash" class="text-green"
      >You can monitor the transaction on
      <a
        class="underline"
        target="_blank"
        :href="`https://moonbase.moonscan.io/tx/${transactionHash}`"
        >Moonbase.</a
      >
    </span>
  </p>

  <!-- Claim succes -->
  <p v-if="(claimSuccess && !claimError) || hasClaimed">
    <span class="text-green">You're $NCTR has been claimed.</span>
    <span v-if="transactionHash" class="text-green"
      >You can see the transaction on
      <a
        class="underline"
        target="_blank"
        :href="`https://moonbase.moonscan.io/tx/${transactionHash}`"
        >Moonbase.</a
      >
    </span>
  </p>

  <p v-if="referralStore.tokenClaim.wallet !== address" class="text-pink">
    Make sure that your connected wallet is the same as submitted EVM wallet address.
  </p>

  <!-- Error message -->
  <p v-if="claimError" class="text-pink">
    Something went wrong. Please try again or try later.<br />Make sure that your connected wallet
    is the same as submitted EVM wallet address.
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
  usedChain,
  chain,
  address,
} = useContract();

const hasClaimed = ref(false);

onMounted(async () => {
  loading.value = true;
  await initContract();
  hasClaimed.value = await getClaimStatus();
  loading.value = false;
  console.log(referralStore.tokenClaim.wallet, address.value);
});

// Disable if:
// No wallet in state
// has already claimed
// has just claimed
// saved wallet is not same as connected wallet
const isDisabled = computed(
  () =>
    !referralStore.tokenClaim.wallet ||
    hasClaimed.value ||
    (claimSuccess.value && !claimError.value) ||
    referralStore.tokenClaim.wallet !== address.value
);

const wrongNetwork = computed(() => {
  return !chain || !chain.value || chain.value.id !== usedChain.id;
});

async function connectWallet() {
  // Verify wallet connection
  if (!isConnected.value) {
    loading.value = true;
    await wagmiConnect(connectors.value[0]);
    loading.value = false;
    return;
  }
}

// Claim
async function claimNctr(e: MouseEvent | null) {
  e?.preventDefault();
  loading.value = true;
  try {
    // Verify wallet connection
    if (!isConnected.value) {
      await wagmiConnect(connectors.value[0]);
      return;
    }

    // Call BE for correct params
    const { signature, timestamp, amount } = await getNctrClaimParams();

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
    return error;
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
