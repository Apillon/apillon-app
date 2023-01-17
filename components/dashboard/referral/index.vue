<template>
  <!-- Referral referres -->
  <ReferralReferres />

  <!-- Connect social accounts -->
  <div class="mt-5">
    <ReferralConnectSection />
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-24 font-button text-sm">
    <!-- Referral intro -->
  </div>

  <div class="grid grid-cols-1 gap-24 font-button text-sm mt-10 mb-20">
    <!-- Referral rewards -->
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-24 font-button text-sm">
    <!-- Referral referres -->

    <!-- Referral - show this section only if this feature is enabled -->
    <template v-if="isFeatureEnabled(Feature.REFERRAL)">
      <!-- Referral connect Twitter and Github -->
    </template>

    <!-- Referral Share -->
    <ReferralShoutoutSection />
  </div>
</template>

<script lang="ts" setup></script>
