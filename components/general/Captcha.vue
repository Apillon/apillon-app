<template>
  <ProcaptchaComponent
    ref="captchaRef"
    :site-key="config.public.captchaKey"
    theme="dark"
    :callback="(token: string) => $emit('captchaVerified', token)"
    :html-attributes="htmlAttributes"
  />
</template>

<script lang="ts" setup>
import { ProcaptchaComponent } from '@prosopo/vue-procaptcha-wrapper';

defineEmits(['captchaVerified']);
const config = useRuntimeConfig();

const htmlAttributes = {
  style: {
    maxWidth: '448px',
  },
};
</script>
