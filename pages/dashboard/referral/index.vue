<template>
  <Dashboard>
    <template #heading>
      <div v-if="step === 1" class="flex">
        <h4 class="-mb-2">{{ $t('referral.title') }}</h4>
        <div class="mx-6 mt-2">|</div>
        <p class="font-button text-sm mb-7 text-white mt-[10px]">
          <strong>{{ $t('referral.learnMore') }}</strong>
        </p>
      </div>
    </template>
    <slot>
      <div v-if="step === 0">
        <ReferralEnter @enter-referral="step = 1" />
      </div>
      <div v-else-if="step === 1">
        <Referral />
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();

useHead({
  title: $i18n.t('referral.title'),
});

const step = ref(0);
</script>
