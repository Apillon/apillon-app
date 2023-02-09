<template>
  <!-- Referral - intro -->
  <div class="bg-bg-light p-8">
    <div class="">
      <div class="flex justify-between">
        <h3 class="mb-6">{{ $t('referral.invite') }}</h3>
        <n-tag type="info" size="large" round>
          <strong>{{ '+2 per referral' }}</strong>
        </n-tag>
      </div>

      <p class="font-button text-sm text-body mt-3 mb-5">
        {{ $t('referral.linkDesc') }}
      </p>

      <p class="font-button text-sm text-white">
        <strong>{{ $t('referral.link') }}</strong>
      </p>

      <div class="max-w-[480px]">
        <div class="px-5 py-2 bg-bg-light mt-2 border-1 border-grey flex justify-between">
          <p>
            {{ referralCode }}
          </p>
          <div class="mt-1 cursor-pointer" @click="copyWalletNumber()">
            <span class="icon-copy text-xl"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Referral - referres -->
    <div class="mt-12 text-white">
      <h4 class="mb-4">
        {{ $t('referral.referres.header') }}
      </h4>

      <p class="font-button text-sm text-body mb-6">
        {{ $t('referral.linkDesc') }}
      </p>

      <div
        class="grid grid-cols-1 md:grid-cols-4 gap-4 font-content text-sm border-b-1 border-bg-lighter pb-3"
      >
        <div class="pl-5 col-span-2">
          <strong>{{ $t('referral.referres.name') }}</strong>
        </div>
        <div class="flex gap-1 items-center">
          <strong>{{ $t('referral.referres.github') }}</strong>
          <span class="icon-info text-2xl"></span>
        </div>
        <div>
          <strong>{{ $t('referral.referres.joined') }}</strong>
        </div>
      </div>
      <div class="">
        <div v-for="(item, index) in referres" :key="index">
          <ReferralReferresRow :item="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';
// const authStore = useAuthStore();
const referralStore = useReferralStore();
const message = useMessage();
const config = useRuntimeConfig();

const referralCode = `${config.public.url}/register/?REF=${referralStore.refCode}`;

function copyWalletNumber() {
  navigator.clipboard.writeText(referralCode);
  message.info('Ref code copied');
}

const referres = referralStore.referrals;
// const referres = [
//   {
//     name: 'f***.y***@g***.com',
//     has_github: true,
//     joined: '32d',
//   },
//   {
//     name: 'f***.y***@g***.com',
//     has_github: false,
//     joined: '1d',
//   },
//   {
//     name: 'f***.y***@g***.com',
//     has_github: true,
//     joined: '32d',
//   },
//   {
//     name: 'f***.y***@g***.com',
//     has_github: true,
//     joined: '32d',
//   },
// ];
</script>
