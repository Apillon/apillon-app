<template>
  <!-- Referral - intro -->
  <div class="bg-grey-dark px-10 py-5">
    <h4>{{ $t('referral.connect') }}</h4>
    <!-- Referral - connect Twitter -->
    <div class="mt-20">
      <FormReferralTwitter />
    </div>
    <div class="mt-20 pt-10">
      <FormReferralGitHub />
    </div>
  </div>

  <!-- Referral - connect GitHub -->
</template>

<script lang="ts" setup></script>
