<template>
  <!-- Referral - intro -->
  <div class="p-8 border-1 border-bg-lighter">
    <h4>Info</h4>

    <p class="mb-4 text-sm text-body">
      <strong>{{ $t('referral.subtitle') }}</strong>
    </p>

    <p class="text-sm text-body">{{ $t('referral.instructionsHeader') }}</p>
    <div class="text-sm text-body">
      {{ $t('referral.instructions.first') }}
    </div>
    <div class="text-sm text-body">
      {{ $t('referral.instructions.second') }}
    </div>
    <div class="text-sm text-body max-w-[540px]">
      {{ $t('referral.instructions.third') }}
    </div>
  </div>
</template>

<script lang="ts" setup></script>
