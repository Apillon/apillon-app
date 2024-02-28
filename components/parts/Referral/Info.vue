<template>
  <!-- Referral - info -->
  <div class="flex flex-col gap-4">
    <div class="card-light p-8">
      <h6>{{ $t('referral.info.collected') }}</h6>
      <h1 class="text-yellow my-2">
        <div v-if="!referralStore.airdrop.totalPoints" class="inline-block h-5 w-9 relative">
          <Spinner :size="20" />
        </div>
        <span v-else class="mr-2">{{ referralStore.airdrop.totalPoints }}</span>
        <NuxtIcon
          name="logo/apillon-icon"
          class="inline-block w-5 h-5 p-1 text-black bg-white rounded-full text-xs"
        />
      </h1>
      <p class="text-xs">
        {{ $t('referral.info.refreshed') }}
      </p>
    </div>

    <div class="card-light p-8">
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
        <li class="my-2 first-line text-bodyDark">
          <NuxtIcon name="icon/success" class="inline-block float-left mr-2 text-2xl" />
          <span>{{ $t(`referral.info.statuses.2`) }}</span>
        </li>
        <li class="my-2 first-line text-bodyDark">
          <NuxtIcon name="icon/success" class="inline-block float-left mr-2 text-2xl" />
          <span>{{ $t(`referral.info.statuses.3`) }}</span>
        </li>
      </ul>
    </div>

    <div class="card-light p-8">
      <h6>
        {{ $t('referral.info.connectAstar') }}
      </h6>
      <p class="mt-4 mb-6 text-sm">
        {{ $t('referral.info.receiveTokens') }}
        <a
          href="https://docs.astar.network/docs/use/manage-wallets/wallet-providers/"
          class="text-white underline"
          target="_blank"
        >
          {{ $t('referral.info.seeHow') }}
        </a>
      </p>

      <AuthWalletConnectAstar />
    </div>

    <div class="card-light p-8">
      <h6>
        {{ $t('referral.info.claim.title') }}
        <IconInfo size="sm" :tooltip="$t('referral.info.claim.tooltip')" />
      </h6>
      <p class="mt-4 mb-6 text-sm">
        {{ $t('referral.info.claim.content') }}
        <a href="https://apillon.io/tge" class="text-white underline" target="_blank">(TGE)</a>
        {{ $t('referral.info.claim.contentEnd') }}
      </p>
      <Btn type="secondary" size="large" disabled>
        {{ $t('referral.info.claim.btn') }}
      </Btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
const authStore = useAuthStore();
const referralStore = useReferralStore();
const referralStatus = ref<number>(1);
</script>
