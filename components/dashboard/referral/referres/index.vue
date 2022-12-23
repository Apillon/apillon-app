<template>
  <!-- Referral - intro -->
  <div class="max-w-[540px]">
    <div class="flex">
      <h4 class="">{{ $t('referral.earnPoints') }}</h4>
      <div class="mx-6 mt-2">|</div>
      <p class="font-button text-sm mb-7 text-white mt-2">
        <strong>{{ $t('referral.learnMore') }}</strong>
      </p>
    </div>

    <h4 class="mb-6 mt-5">{{ $t('referral.invite') }}</h4>

    <p class="font-button text-sm mb-4 text-white">
      <strong>{{ $t('referral.link') }}</strong>
    </p>

    <n-input v-model:value="referralCode" disabled />
    <p class="font-button text-sm text-white mt-3">
      {{ $t('referral.linkDesc') }}
    </p>
  </div>

  <!-- Referral - points -->
  <div class="text-white">
    <p class="font-button text-sm mb-8 text-white mt-20">
      <strong>{{ $t('referral.referres.header') }}</strong>
    </p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 font-content text-sm">
      <div class="pl-5">
        <strong>{{ $t('referral.referres.name') }}</strong>
      </div>
      <div>
        <strong>{{ $t('referral.referres.github') }}</strong>
      </div>
      <div>
        <strong>{{ $t('referral.referres.joined') }}</strong>
      </div>
    </div>
    <div class="grid grid-cols-1 gap-4 font-content text-sm mt-4">
      <div v-for="(item, index) in referres" :key="index">
        <ReferralReferresRow :item="item" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const referralCode = 'https://apillon.io/register/?REF=X5FGH';

const referres = [
  {
    name: 'f***.y***@g***.com',
    github: true,
    joined: '32d',
  },
  {
    name: 'f***.y***@g***.com',
    github: false,
    joined: '1d',
  },
  {
    name: 'f***.y***@g***.com',
    github: true,
    joined: '32d',
  },
  {
    name: 'f***.y***@g***.com',
    github: true,
    joined: '32d',
  },
];
</script>
