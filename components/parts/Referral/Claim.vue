<template>
  <n-form ref="formTasksReviewRef" :model="formData" disabled="isDisabled">
    <h4>Claim your $NCTR</h4>

    <!-- notifications -->
    <!-- <Notification v-if="referralStore.tokenClaim.claimCompleted" type="warning" class="w-full mb-8">
      {{ $t('referral.info.claim.alreadyClaimed') }}
    </Notification>
    <Notification v-else-if="isDisabled" type="warning" class="w-full mb-8">
      {{ $t('referral.info.claim.inReview') }}
    </Notification> -->

    <n-form-item :show-label="false" :show-feedback="false">
      <!-- TODO: do we need this hidden input? -->
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

type AirdropForm = {
  terms?: boolean;
};

// const { connectAndSign } = useWallet();

// const { connect, connectors } = useConnect();
// const { refetch: refetchWalletClient } = useWalletClient();
// const { address, isConnected } = useAccount({ onConnect: onWalletConnected });
const referralStore = useReferralStore();
const formData = ref<AirdropForm>({
  terms: false,
});
const loading = ref<boolean>(false);

async function claimNctr(e: MouseEvent | null) {
  e?.preventDefault();
  try {
    // define response AND ADD ?wallet qp
    const { data } = await $api.get(
      `${endpoints.referralClaimParams}/?wallet=0x97a6f35fa40bc4eb73247965f43cb99a13ff05d0`
    );
    console.log(data);

    // return data
  } catch (error) {
    console.error(error);
  }
}

const isDisabled = ref(false);
// const isDisabled = computed(
//   () => !!referralStore.tokenClaim.wallet || referralStore.tokenClaim.claimCompleted
// );

// AFTER WE GET CLAIM BACK WE NEED TO CALL claim on the smart conntract

// Additionally, one more contract call (read)
// should be called with the function walletClaimed(address),
// which returns true or false indicating if the user’s
// address has already claimed tokens. This will be used only for UI
// state (indicators, disabling claim button and similar).
</script>
