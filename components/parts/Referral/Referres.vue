<template>
  <!-- Referral - intro -->
  <div class="card-dark p-8">
    <div class="">
      <div class="flex justify-between">
        <h3 class="mb-6">{{ $t('referral.referres.invite') }}</h3>

        <!-- TAG
        <n-tag type="info" size="medium" round>
          <strong class="lowercase text-base">+2 per referral</strong>
        </n-tag> -->
      </div>

      <p class="font-button text-sm text-body mt-3 mb-5">
        {{ $t('referral.referres.linkDesc') }}
      </p>

      <p class="font-button text-sm text-white">
        <strong>{{ $t('referral.referres.link') }}</strong>
      </p>

      <div class="max-w-[480px]">
        <div class="h-12 px-5 py-2 bg-bg-light mt-2 border-1 border-grey flex justify-between">
          <p class="leading-7 whitespace-nowrap overflow-hidden">
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

      <p class="font-button text-sm text-body mb-8 whitespace-pre-line">
        {{ $t('referral.referres.info') }}
      </p>

      <div
        class="grid grid-cols-1 md:grid-cols-4 gap-4 font-content text-sm border-b-1 border-bg-lighter pb-3"
      >
        <div class="pl-5 col-span-2">
          <strong>{{ $t('referral.referres.name') }}</strong>
        </div>
        <div class="flex gap-1 items-center">
          <strong>{{ $t('referral.referres.active') }}</strong>
        </div>
        <div>
          <strong>{{ $t('referral.referres.joined') }}</strong>
        </div>
      </div>
      <div class="">
        <div v-for="(item, index) in referralStore.referrals" :key="index">
          <ReferralReferresRow :item="item" />
        </div>
        <div class="mt-12">
          <p>
            <i>{{ $t('referral.referres.disclaimer') }}</i>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const referralStore = useReferralStore();
const message = useMessage();
const config = useRuntimeConfig();

const referralCode = computed(() => `${config.public.url}/register/?REF=${referralStore.refCode}`);

function copyWalletNumber() {
  navigator.clipboard.writeText(referralCode.value);
  message.info('Ref code copied');
}
</script>
