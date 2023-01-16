<template>
  <!-- Referral - intro -->
  <div class="bg-grey-dark px-10 py-5">
    <div class="max-w-[700px]">
      <h4 class="mb-6 mt-5">{{ $t('referral.invite') }}</h4>

      <p class="font-button text-sm text-white mt-3">
        {{ $t('referral.linkDesc') }}
      </p>

      <p class="font-button text-sm mb-4 text-white">
        <strong>{{ $t('referral.link') }}</strong>
      </p>

      <div class="max-w-[480px]">
        <div class="p-4 bg-grey-dark mt-2 border-1 border-grey flex justify-between">
          <p>
            {{ referralCode }}
          </p>
          <div class="mt-1 cursor-pointer" @click="copyWalletNumber()">ikona</div>
        </div>
      </div>
    </div>

    <!-- Referral - points -->
    <div class="text-white">
      <p class="font-button text-sm mb-8 text-white mt-20">
        <strong>{{ $t('referral.referres.header') }}</strong>
      </p>

      <p class="font-button text-sm text-white mt-3 max-w-[700px] mb-5">
        {{ $t('referral.linkDesc') }}
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
  </div>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';
// const authStore = useAuthStore();
const referralStore = useReferralStore();
const message = useMessage();

const referralCode = `https://apillon.io/register/?REF=${referralStore.refCode}`;

function copyWalletNumber() {
  navigator.clipboard.writeText(referralCode);
  message.info('Wallet number copied');
}

const referres = referralStore.referrals;
// [
//   {
//     name: 'f***.y***@g***.com',
//     github: true,
//     joined: '32d',
//   },
//   {
//     name: 'f***.y***@g***.com',
//     github: false,
//     joined: '1d',
//   },
//   {
//     name: 'f***.y***@g***.com',
//     github: true,
//     joined: '32d',
//   },
//   {
//     name: 'f***.y***@g***.com',
//     github: true,
//     joined: '32d',
//   },
// ];
</script>
