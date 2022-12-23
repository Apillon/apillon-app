<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-24 font-button text-sm">
    <!-- Referral intro -->
    <ReferralIntro :points="3" />
  </div>

  <div class="grid grid-cols-1 gap-24 font-button text-sm mt-10 mb-20">
    <!-- Referral - images -->
    <div class="bg-grey-rewardsBg">
      <p class="mb-10 text-center font-button text-sm">{{ $t('referral.included') }}</p>
      <div class="flex flex-wrap justify-evenly gap-3 md:gap-6 lg:gap-9">
        <div v-for="(img, index) in merchImages" :key="index">
          <img :src="img" alt="apillon merch" />
          <div class="font-button text-sm text-dark max-w-[230px] mb-5 mt-8">
            {{ $t('referral.rewards.shirt.info') }}
            <div>
              {{ $t('referral.rewards.shirt.info1') }}
            </div>
            <div>
              {{ $t('referral.rewards.shirt.info2') }}
            </div>
            <div>
              {{ $t('referral.rewards.shirt.info3') }}
            </div>
          </div>
          <Btn type="primary">{{ $t('referral.claim') }}</Btn>
        </div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-24 font-button text-sm">
    <ReferralReferres />

    <!-- Referral - show this section only if this feature is enabled -->
    <template v-if="isFeatureEnabled(Feature.REFERRAL)">
      <ReferralConnect />
    </template>

    <ReferralShoutout />
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
