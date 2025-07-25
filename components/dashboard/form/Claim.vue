<template>
  <!-- button -->
  <template v-if="!hasClaimed && referralStore.tokenClaim.wallet && referralStore.tokenClaim.status === 5">
    <Btn v-if="!isConnected" type="primary" size="large" class="mt-2" :loading="loading" @click="connectWallet">
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
    <Btn v-else type="primary" size="large" class="mt-2" :loading="loading" :disabled="isDisabled" @click="claimNctr">
      {{ $t('referral.info.claim.claim') }}
    </Btn>
  </template>

  <!-- Airdrop finished -->
  <Notification v-if="!referralStore.tokenClaim?.wallet" type="info"> The NCTR Airdrop is now finished. </Notification>

  <!-- Being claimed -->
  <Notification v-if="transactionHash && !claimSuccess" type="success" class="w-full">
    <span>Your $NCTR is being claimed.</span>
    <span v-if="transactionHash"
      >You can monitor the transaction on
      <a class="underline" target="_blank" :href="`https://moonbeam.moonscan.io/x/${transactionHash}`">Moonbeam.</a>
    </span>
  </Notification>

  <template v-if="referralStore.tokenClaim?.wallet">
    <Notification v-if="(claimSuccess && !claimError) || hasClaimed" type="success" class="w-full">
      <span class="text-green">Your $NCTR has been claimed.</span>
      <span v-if="transactionHash || referralStore.tokenClaim.transactionHash" class="text-green"
        >You can see the transaction on
        <a
          class="underline"
          target="_blank"
          :href="`https://moonbeam.moonscan.io/tx/${transactionHash ? transactionHash : referralStore.tokenClaim.transactionHash}`"
          >Moonbeam.</a
        >
      </span>
    </Notification>
  </template>

  <Notification v-if="referralStore.tokenClaim.status !== 5" type="warning" class="w-full">
    <strong
      >Account disqualified from rewards due breach of
      <a target="_blank" href="https://apillon.io/privacy-policy/">Privacy Policy.</a></strong
    ><br /><br />
    We detected unauthorized, fraudulent and/or illicit activities aimed at directly or indirectly manipulating,
    distorting or otherwise illicitly influencing the reward outcomes from the Programs.
    <!-- <a target="_blank" href="https://apillon.io/privacy-policy/">Privacy Policy</a>. -->
  </Notification>

  <!-- Fix connection errro -->
  <template v-if="referralStore.tokenClaim?.wallet">
    <Notification
      v-if="referralStore.tokenClaim.wallet !== address && referralStore.tokenClaim.status === 5"
      type="warning"
      class="w-full"
    >
      Make sure that your connected wallet is the same as submitted EVM wallet address.
    </Notification>
  </template>

  <!-- Error message -->
  <Notification v-if="claimError" type="error" class="w-full">
    Something went wrong. Please try again or try later.<br />Make sure that your connected wallet is the same as
    submitted EVM wallet address.
  </Notification>

  <template v-if="referralStore.tokenClaim.status === 5 && referralStore.tokenClaim?.wallet">
    <div class="border-b-1 border-bg-lighter"></div>

    <NctrAddTokenBtn />
  </template>
</template>

<script setup lang="ts">
import { useAccount, useChainId, useConnect, useConnectorClient, useAccountEffect } from '@wagmi/vue';

const chainId = useChainId();
const { connect, connectors } = useConnect();
const { refetch: refetchWalletClient } = useConnectorClient();
const { isConnected } = useAccount();
const referralStore = useReferralStore();
useAccountEffect({ onConnect: onWalletConnected });

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
  address,
} = useContract();

const hasClaimed = ref(false);

onMounted(async () => {
  loading.value = true;
  await initContract();
  try {
    hasClaimed.value = await getClaimStatus();
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
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
    referralStore.tokenClaim.wallet.toLowerCase() !== address.value?.toLowerCase() ||
    referralStore.tokenClaim.status !== 5
);

const wrongNetwork = computed(() => {
  return chainId.value !== usedChain.id;
});

async function connectWallet() {
  await wagmiConnect(connectors[0]);
}

// Claim
async function claimNctr(e: MouseEvent | null) {
  e?.preventDefault();
  loading.value = true;
  try {
    // Verify wallet connection
    if (!isConnected.value) {
      await wagmiConnect(connectors[0]);
      return;
    }

    // Call BE for correct params
    const { signature, timestamp, amount } = await getNctrClaimParams();

    if (!signature || !timestamp || !amount) {
      throw new Error('Invalid claim parameters');
    }

    // Final claim on contract
    hasClaimed.value = !!(await claimTokens(amount, timestamp, signature));
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
    return {} as NctrClaimParams;
  }
}

async function wagmiConnect(connector) {
  if (isConnected.value) {
    refetchWalletClient();
  } else {
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
