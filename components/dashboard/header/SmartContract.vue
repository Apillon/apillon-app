<template>
  <Heading>
    <slot>
      <NuxtLink class="flex items-center gap-x-2" :to="link">
        <span class="icon-back text-2xl align-sub"></span>
        <h1>{{ $t('dashboard.nav.smartContracts') }}</h1>
      </NuxtLink>
    </slot>
    <template #info> </template>
  </Heading>
</template>

<script lang="ts" setup>
defineProps({
  link: { type: String, default: '/dashboard/service/smart-contracts' },
});
</script>
