<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-24 font-button text-sm">
    <!-- Referral intro -->
    <ReferralIntro :points="3" />
  </div>

  <div class="grid grid-cols-1 gap-24 font-button text-sm mt-10 mb-20">
    <!-- Referral rewards -->
    <ReferralRewards />
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-24 font-button text-sm">
    <!-- Referral referres -->
    <ReferralReferres />

    <!-- Referral - show this section only if this feature is enabled -->
    <template v-if="isFeatureEnabled(Feature.REFERRAL)">
      <!-- Referral connect Twitter and Github -->
      <ReferralConnect />
    </template>

    <!-- Referral Share -->
    <ReferralShoutout />
  </div>
</template>

<script lang="ts" setup></script>
