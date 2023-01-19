<template>
  <!-- Referral - intro -->
  <div class="bg-bg-light p-8">
    <div class="mt-5 flex justify-between">
      <h4>{{ $t('referral.connect') }}</h4>
      <n-tag type="info" size="large" round>
        <strong>{{ '+2 per connection' }}</strong>
      </n-tag>
    </div>

    <!-- Referral - connect Twitter -->
    <div class="mt-4">
      <FormReferralTwitter />
    </div>

    <!-- Referral - connect GitHub -->
    <div>
      <FormReferralGitHub />
    </div>
  </div>
</template>

<script lang="ts" setup></script>
