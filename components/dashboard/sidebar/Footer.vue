<template>
  <div v-if="isFeatureEnabled(Feature.BILLING)" class="flex flex-col px-6 py-2">
    <p class="mb-2">
      <strong>{{ $t('dashboard.yourPlan') }}</strong>
      <span>Free plan</span>
    </p>
    <Btn type="secondary" size="small">
      <strong>Upgrade to PRO</strong>
    </Btn>
    <p class="mt-8 text-sm text-grey text-center">
      {{ $t('general.copyrights') }}
      <span>1.0.1</span>
    </p>
  </div>
</template>

<script lang="ts" setup></script>
