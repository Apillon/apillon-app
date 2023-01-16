<template>
  <!-- Referral - intro -->
  <div>
    <h4>Info</h4>

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
</template>

<script lang="ts" setup></script>
