<template>
  <template v-if="hasClaimed">
    <h1>You've already successfully claimed your $NCTR</h1>
  </template>
  <template v-else>
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
</template>

<script setup lang="ts">
import { useAccount, useConnect, useWalletClient } from 'use-wagmi';

const { connectAndSign } = useWallet();
const { connect, connectors } = useConnect();
const { refetch: refetchWalletClient } = useWalletClient();
const { isConnected } = useAccount({ onConnect: onWalletConnected });
const referralStore = useReferralStore();

const { initContract, getClaimStatus } = useContract();

const loading = ref<boolean>(true);
const hasClaimed = ref(false);

const isDisabled = computed(
  () => !referralStore.tokenClaim.wallet || referralStore.tokenClaim.claimCompleted
);

onMounted(async () => {
  await initContract();
  hasClaimed.value = await getClaimStatus();
  loading.value = false;
});

async function claimNctr() {
  try {
    if (!isConnected.value) {
      await wagmiConnect(connectors.value[0]);
    }

    const sign = await connectAndSign();
    if (!sign) {
      loading.value = false;
    }

    // 2. TODO: define response
    const res = await $api.get(endpoints.referralClaimParams);
    // console.log(res);
    // 3. TODO get {signature, timestamp, amount} from res
    // 4.TODO:  call claim on the smart contract with params (signature, timestamp, amount)
    loading.value = false;
  } catch (error) {
    console.error(error);
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
    // TODO: we can get initial params here
    // 1. TODO: Call walletClaimed(address) : true | false <- user had claimed tokens

    console.log('wallet connected');
  }
}
</script>
