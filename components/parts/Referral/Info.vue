<template>
  <!-- Referral - info -->
  <div class="flex flex-col gap-4">
    <div class="card p-8">
      <h6>{{ $t('referral.info.collected') }}</h6>
      <h1 class="my-2 text-yellow">
        <div v-if="referralStore.airdrop?.totalPoints === undefined" class="relative inline-block h-5 w-9">
          <Spinner :size="20" />
        </div>
        <span v-else-if="referralStore.tokenClaim.totalNctr > 0" class="mr-2">
          {{ referralStore.tokenClaim.totalNctr }}
        </span>
        <span v-else class="mr-2">{{ referralStore.airdrop.totalPoints }}</span>
        <NuxtIcon name="logo/apillon-icon" class="inline-block h-5 w-5 rounded-full bg-white p-1 text-xs text-black" />
      </h1>
    </div>

    <div v-if="referralStore.airdrop.totalPoints > 0" class="card p-8">
      <h6>{{ $t('referral.info.status') }}</h6>

      <ul class="mt-4">
        <li class="first-line my-2 text-green">
          <NuxtIcon name="icon/success" class="float-left mr-2 inline-block text-2xl" />
          <span>{{ $t(`referral.info.statuses.0`) }}</span>
        </li>
        <li class="my-2" :class="authStore.user.evmWallet ? 'text-green' : 'text-bodyDark'">
          <NuxtIcon name="icon/success" class="float-left mr-2 inline-block text-2xl" />
          <span>{{ $t(`referral.info.statuses.1`) }}</span>
        </li>
        <li class="my-2" :class="isSubmitted ? 'text-green' : 'text-bodyDark'">
          <NuxtIcon name="icon/success" class="float-left mr-2 inline-block text-2xl" />
          <span>{{ $t(`referral.info.statuses.2`) }}</span>
        </li>
        <li v-if="referralStore.tokenClaim?.wallet" class="my-2 text-green">
          <NuxtIcon name="icon/success" class="float-left mr-2 inline-block text-2xl" />
          <span>{{ $t(`referral.info.statuses.3`) }}</span>
        </li>
      </ul>
    </div>

    <div v-if="referralStore.airdrop.totalPoints > 0 && referralStore.tokenClaim?.wallet" class="card p-8">
      <h6>
        {{ $t('referral.info.connectAstar') }}
      </h6>
      <p class="mb-6 mt-4 text-sm">
        {{ $t('referral.info.receiveTokens') }}
      </p>

      <AuthWalletConnectAstar />
    </div>

    <FormClaim />
  </div>
</template>

<script lang="ts" setup>
const authStore = useAuthStore();
const referralStore = useReferralStore();

const isSubmitted = computed(
  () => referralStore.inReview || !!referralStore.tokenClaim.wallet || referralStore.tokenClaim.claimCompleted
);
</script>
