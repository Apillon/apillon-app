<template>
  <Dashboard>
    <template #heading>
      <div class="flex">
        <h4 class="-mb-2">{{ $t('referral.title') }}</h4>
        <div class="mx-6 mt-2">|</div>
        <p class="font-button text-sm mb-7 text-white mt-[10px]">
          <strong>{{ $t('referral.learnMore') }}</strong>
        </p>
      </div>
    </template>
    <slot>
      <Referral />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();

useHead({
  title: $i18n.t('referral.title'),
});
</script>
