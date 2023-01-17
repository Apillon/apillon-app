<template>
  <!-- Referral - intro -->
  <div class="bg-grey-dark px-10 py-5">
    <div class="mt-5 flex justify-between">
      <h4>{{ $t('referral.connect') }}</h4>
      <div>
        {{ '+2 per connection' }}
      </div>
    </div>
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
