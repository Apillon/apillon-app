<template>
  <div class="flex items-center">
    <NInput :value="value" :type="'password'" readonly show-password-on="click" />
  </div>
</template>

<script setup lang="ts">
import { NInput } from 'naive-ui';

defineProps<{
  value: string;
}>();
</script>
