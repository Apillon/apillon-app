<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-24 font-button text-sm">
    <!-- Referral - intro -->
    <div>
      <p class="font-button text-sm mb-7">
        <strong>{{ $t('referral.subtitle') }}</strong>
      </p>
      <p class="font-button text-sm">{{ $t('referral.content') }}</p>
    </div>
    <!-- Referral - images -->
    <div>
      <p class="mb-10 text-center font-button text-sm">{{ $t('referral.included') }}</p>
      <div class="flex flex-wrap justify-evenly gap-3 md:gap-6 lg:gap-9">
        <div v-for="(img, index) in merchImages" :key="index">
          <img :src="img" alt="apillon merch" />
        </div>
      </div>
    </div>

    <!-- Referral - show this section only if this feature is enabled -->
    <template v-if="isFeatureEnabled(Feature.REFERRAL)">
      <!-- Referral - points -->
      <div class="text-center">
        <p class="font-button text-sm mb-11">
          <strong>{{ $t('referral.yourPoints') }}</strong>
        </p>
        <p class="font-button text-2xl md:text-[48px] mb-14">3</p>
        <Btn type="primary">{{ $t('referral.claimMerchPack') }}</Btn>
      </div>
      <!-- Referral - empty space -->
      <div></div>

      <!-- Referral - connect Twitter -->
      <div>
        <FormReferralTwitter />
      </div>

      <!-- Referral - connect GitHub -->
      <div>
        <FormReferralGitHub />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
const merchImages = [
  '/images/referral/merch_1.jpg',
  '/images/referral/merch_2.jpg',
  '/images/referral/merch_3.jpg',
  '/images/referral/merch_4.jpg',
];
</script>
