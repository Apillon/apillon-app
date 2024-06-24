<template>
  <!-- Referral - info -->
  <div class="flex flex-col gap-4">
    <div class="card p-8">
      <h6>{{ $t('referral.info.collected') }}</h6>
      <h1 class="text-yellow my-2">
        <div
          v-if="referralStore.airdrop?.totalPoints === undefined"
          class="inline-block h-5 w-9 relative"
        >
          <Spinner :size="20" />
        </div>
        <span v-else-if="referralStore.tokenClaim.totalNctr > 0" class="mr-2">
          {{ referralStore.tokenClaim.totalNctr }}
        </span>
        <span v-else class="mr-2">{{ referralStore.airdrop.totalPoints }}</span>
        <NuxtIcon
          name="logo/apillon-icon"
          class="inline-block w-5 h-5 p-1 text-black bg-white rounded-full text-xs"
        />
      </h1>
    </div>

    <div v-if="referralStore.airdrop.totalPoints > 0" class="card p-8">
      <h6>{{ $t('referral.info.status') }}</h6>

      <ul class="mt-4">
        <li class="my-2 first-line text-green">
          <NuxtIcon name="icon/success" class="inline-block float-left mr-2 text-2xl" />
          <span>{{ $t(`referral.info.statuses.0`) }}</span>
        </li>
        <li class="my-2" :class="authStore.user.evmWallet ? 'text-green' : 'text-bodyDark'">
          <NuxtIcon name="icon/success" class="inline-block float-left mr-2 text-2xl" />
          <span>{{ $t(`referral.info.statuses.1`) }}</span>
        </li>
        <li class="my-2" :class="isSubmitted ? 'text-green' : 'text-bodyDark'">
          <NuxtIcon name="icon/success" class="inline-block float-left mr-2 text-2xl" />
          <span>{{ $t(`referral.info.statuses.2`) }}</span>
        </li>
        <li
          class="my-2"
          :class="referralStore.tokenClaim.claimCompleted ? 'text-green' : 'text-bodyDark'"
        >
          <NuxtIcon name="icon/success" class="inline-block float-left mr-2 text-2xl" />
          <span>{{ $t(`referral.info.statuses.3`) }}</span>
        </li>
      </ul>
    </div>

    <div v-if="referralStore.airdrop.totalPoints > 0" class="card p-8">
      <h6>
        {{ $t('referral.info.connectAstar') }}
      </h6>
      <p class="mt-4 mb-6 text-sm">
        {{ $t('referral.info.receiveTokens') }}
        <!-- <a
          href="https://docs.astar.network/docs/use/manage-wallets/wallet-providers/"
          class="text-white underline"
          target="_blank"
        >
          {{ $t('referral.info.seeHow') }}
        </a> -->
      </p>

      <AuthWalletConnectAstar />
    </div>

    <div v-if="referralStore.airdrop.totalPoints > 0" class="card-light p-8">
      <div class="p-8 bg-white border border-solid rounded-lg">
        <h6 class="text-black">
          {{ $t('referral.info.claim.title') }}
        </h6>
        <p class="mt-4 mb-6 text-sm text-black">
          {{ $t('referral.info.claim.content') }}
        </p>
      </div>

      <!-- <FormAirdrop /> -->
    </div>
    <FormClaim />
  </div>
</template>

<script lang="ts" setup>
const authStore = useAuthStore();
const referralStore = useReferralStore();

const isSubmitted = computed(
  () =>
    referralStore.inReview ||
    !!referralStore.tokenClaim.wallet ||
    referralStore.tokenClaim.claimCompleted
);
</script>
