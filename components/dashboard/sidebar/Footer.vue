<template>
  <div class="flex flex-col p-8">
    <p class="text-sm text-body">
      {{ $t('general.copyrights') }}
      <span>{{ version }}</span>
    </p>
  </div>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig();
const version = ref(config.public.VERSION);
</script>
