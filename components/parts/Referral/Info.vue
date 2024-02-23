<template>
  <!-- Referral - info -->
  <div class="flex flex-col gap-4">
    <div class="card-light p-8">
      <h6>{{ $t('referral.info.collected') }}</h6>
      <h1 class="text-yellow my-2">
        <span class="mr-2">{{ referralStore.airdrop.totalPoints || 0 }}</span>
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
        <li
          v-for="i in [...Array(4).keys()]"
          class="my-2"
          :class="referralStatus <= i ? 'text-bodyDark' : 'text-green'"
        >
          <NuxtIcon name="icon/success" class="inline-block float-left mr-2 text-2xl" />
          <span>{{ $t(`referral.info.statuses.${i}`) }}</span>
        </li>
      </ul>
    </div>

    <div class="card-light p-8">
      <h6>{{ $t('referral.info.connectAstar') }}</h6>
      <p class="mt-4 mb-6 text-sm">
        {{ $t('referral.info.receiveTokens') }}
        <a href="" class="text-white underline" target="_blank">
          {{ $t('referral.info.seeHow') }}
        </a>
      </p>

      <div class="mb-4">
        <label class="text-xs"> {{ $t('referral.info.astarAddress') }}</label>
        <n-input class="bg-bg-dark" disabled />
      </div>

      <Btn type="secondary" size="large" disabled>
        {{ $t('referral.info.connectWallet') }}
      </Btn>
    </div>

    <div class="card-light p-8">
      <h6>{{ $t('referral.info.claim.title') }}</h6>
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
const referralStore = useReferralStore();
const referralStatus = ref<number>(1);
</script>
