<template>
  <!-- Referral - Airdrop -->
  <div class="card-dark p-8 mb-8">
    <div class="max-w-lg">
      <h3>{{ $t('referral.airdrop.subscribe.headline') }}</h3>
      <p class="mb-10 whitespace-break-spaces">
        {{ $t('referral.airdrop.subscribe.headlineInfo') }}
      </p>

      <h4>{{ $t('referral.airdrop.subscribe.title') }}</h4>
      <p class="mb-6 whitespace-break-spaces">{{ $t('referral.airdrop.subscribe.content') }}</p>

      <p class="mb-4">
        <span>{{ $t('referral.airdrop.subscribe.info') }}</span>
        <Btn
          class="inline-block text-sm ml-1"
          type="link"
          href="https://apillon.io/privacy-policy/"
          target="_blank"
        >
          {{ $t('profile.marketing.privacy') }}
        </Btn>
      </p>
      <FormNewsletter size="medium" :btn-text="$t('referral.airdrop.subscribe.btn')" />
    </div>
  </div>
</template>

<script lang="ts" setup></script>
