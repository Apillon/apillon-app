<template>
  <Heading>
    <slot>
      <n-space align="center" :size="32">
        <NuxtLink :to="{ name: 'dashboard-service-hosting' }">
          <span class="icon-back"></span>
        </NuxtLink>
        <h4>{{ websiteStore.active.name }}</h4>

        <n-space align="center" size="small" :wrap="false">
          <span>{{ $t('hosting.website.uuid') }}:</span>
          <n-ellipsis class="text-body align-bottom" :line-clamp="1">
            {{ websiteStore.active.website_uuid }}
          </n-ellipsis>
          <button class="text-body" @click="copyToClipboard(websiteStore.active.website_uuid)">
            <span class="icon-copy"></span>
          </button>
        </n-space>
      </n-space>
    </slot>

    <template #info> </template>

    <template #submenu>
      <MenuHosting />
    </template>
  </Heading>
</template>

<script lang="ts" setup>
const websiteStore = useWebsiteStore();
</script>
