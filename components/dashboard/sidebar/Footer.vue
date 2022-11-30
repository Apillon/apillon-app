<template>
  <div class="flex flex-col px-6 py-2">
    <template v-if="isFeatureEnabled(Feature.BILLING)">
      <p class="mb-2">
        <strong>{{ $t('dashboard.yourPlan') }}</strong>
        <span>Free plan</span>
      </p>
      <Btn type="secondary">
        <strong>Upgrade to PRO</strong>
      </Btn>
    </template>
    <p class="mt-8 text-sm text-grey text-center">
      {{ $t('general.copyrights') }}
      <span>{{ version }}</span>
    </p>
  </div>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig();
const version = ref(config.public.VERSION);
</script>
