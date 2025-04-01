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

      <p class="font-button mb-5 mt-3 text-sm text-body">
        {{ $t('referral.referres.linkDesc') }}
      </p>

      <p class="font-button text-sm text-white">
        <strong>{{ $t('referral.referres.link') }}</strong>
      </p>

      <div class="max-w-[480px]">
        <div class="border-grey mt-2 flex h-12 justify-between border-1 bg-bg-light px-5 py-2">
          <p class="overflow-hidden whitespace-nowrap leading-7">
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

      <p class="font-button mb-8 whitespace-pre-line text-sm text-body">
        {{ $t('referral.referres.info') }}
      </p>

      <div class="font-content grid grid-cols-1 gap-4 border-b-1 border-bg-lighter pb-3 text-sm md:grid-cols-4">
        <div class="col-span-2 pl-5">
          <strong>{{ $t('referral.referres.name') }}</strong>
        </div>
        <div class="flex items-center gap-1">
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
