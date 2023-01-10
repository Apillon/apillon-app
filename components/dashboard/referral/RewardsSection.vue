<template>
  <!-- Referral - sharing -->
  <!-- Referral - rewards -->
  <div class="bg-grey-rewardsBg">
    <h4>{{ $t('referral.rewards.title') }}</h4>
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
        <Btn type="primary" @click="claimReward(img)">{{ $t('referral.claim') }}</Btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const merchImages = [
  '/images/referral/merch_1.jpg',
  '/images/referral/merch_2.jpg',
  '/images/referral/merch_3.jpg',
  '/images/referral/merch_4.jpg',
];

const emit = defineEmits(['claimReward']);

function claimReward(img) {
  emit('claimReward', img);
}
</script>
