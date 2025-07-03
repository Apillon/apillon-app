<template>
  <div class="text-center">
    <div class="flex flex-col gap-2 text-blue">
      <span class="icon-credits mx-auto inline-block align-text-top text-4xl"></span>
      <strong class="inline-block text-xs"> 1200 {{ $t('dashboard.onboarding.modal.token.reward') }}</strong>
    </div>
    <h4 class="my-6">{{ $t('dashboard.onboarding.modal.token.title') }}</h4>
    <p>{{ $t('dashboard.onboarding.modal.token.info') }}</p>
    <SeparatorText />

    <h4 class="my-6">{{ $t('dashboard.onboarding.modal.token.nctr') }}</h4>
    <p>{{ $t('dashboard.onboarding.modal.token.content') }}</p>
    <Btn class="mt-6 min-w-60" size="large" @click="$emit('close')">
      {{ $t('auth.onboarding.getStarted') }}
    </Btn>
  </div>
</template>

<script lang="ts" setup>
defineEmits(['close']);
</script>
