<template>
  <!-- Referral - intro -->
  <div>
    <p class="font-button text-sm mb-7 text-white">
      <strong>{{ $t('referral.subtitle') }}</strong>
    </p>

    <p class="font-button text-sm text-white">{{ $t('referral.instructionsHeader') }}</p>
    <div class="font-button text-sm text-white">
      {{ $t('referral.instructions.first') }}
    </div>
    <div class="font-button text-sm text-white">
      {{ $t('referral.instructions.second') }}
    </div>
    <div class="font-button text-sm text-white max-w-[540px]">
      {{ $t('referral.instructions.third') }}
    </div>
  </div>

  <!-- Referral - points -->
  <div class="text-center md:mr-20 md:pr-10 md:mt-5 text-white">
    <p class="font-button text-sm mb-11">
      <strong>{{ $t('referral.yourPoints') }}</strong>
    </p>
    <p class="font-button text-2xl md:text-[48px] mb-4">{{ referralStore.balance }}</p>
  </div>
</template>

<script lang="ts" setup>
const referralStore = useReferralStore();
defineProps({
  points: { type: Number, required: true },
});
</script>
