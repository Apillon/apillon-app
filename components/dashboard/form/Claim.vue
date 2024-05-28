<template>
  <n-form ref="formClaimNctrRef">
    <h4>Claim your $NCTR</h4>

    <!-- notifications -->
    <!-- <Notification v-if="referralStore.tokenClaim.claimCompleted" type="warning" class="w-full mb-8">
        {{ $t('referral.info.claim.alreadyClaimed') }}
      </Notification>
      <Notification v-else-if="isDisabled" type="warning" class="w-full mb-8">
        {{ $t('referral.info.claim.inReview') }}
      </Notification> -->

    <n-form-item :show-label="false" :show-feedback="false">
      <input type="submit" class="hidden" :value="$t('referral.info.claim.claim')" />

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
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
import { useAccount, useConnect, useWalletClient } from 'use-wagmi';

// const { t } = useI18n();
// const message = useMessage();

const { connectAndSign } = useWallet();
const { connect, connectors } = useConnect();
const { refetch: refetchWalletClient } = useWalletClient();
const { address, isConnected } = useAccount({ onConnect: onWalletConnected });
const referralStore = useReferralStore();

const loading = ref<boolean>(false);

const isDisabled = computed(
  () => !referralStore.tokenClaim.wallet || referralStore.tokenClaim.claimCompleted
);

async function claimNctr(e: MouseEvent | null) {
  e?.preventDefault();
  try {
    loading.value = true;

    if (!isConnected.value) {
      await wagmiConnect(connectors.value[0]);
    }

    const sign = await connectAndSign();
    if (!sign) {
      loading.value = false;
    }

    // 2. TODO: define response
    const res = await $api.get(`${endpoints.referralClaimParams}/?wallet=${address.value}`);
    // console.log(res);
    // 3. TODO get {signature, timestamp, amount} from res
    // 4.TODO:  call claim on the smart contract with params (signature, timestamp, amount)
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
  }
}
</script>
