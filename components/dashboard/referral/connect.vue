<template>
  <!-- Referral - intro -->
  <div>
    <h4>{{ $t('referral.connect') }}</h4>
    <!-- Referral - connect Twitter -->
    <div class="mt-20">
      <FormReferralTwitter />
    </div>
  </div>

  <!-- Referral - connect GitHub -->
  <div class="mt-20 pt-10">
    <FormReferralGitHub />
  </div>
</template>

<script lang="ts" setup></script>
