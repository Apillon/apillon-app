<template>
  <Heading>
    <slot>
      <n-space align="center" :size="32">
        <NuxtLink :to="{ name: 'dashboard-service-hosting' }">
          <span class="icon-back"></span>
        </NuxtLink>
        <h4>{{ webpageStore.active.name }}</h4>
      </n-space>
    </slot>

    <template #info> </template>

    <template #submenu>
      <MenuHosting />
    </template>
  </Heading>
</template>

<script lang="ts" setup>
const webpageStore = useWebpageStore();
</script>
