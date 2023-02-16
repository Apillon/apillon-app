<template>
  <Heading>
    <slot>
      <n-space align="center" :size="32">
        <NuxtLink :to="{ name: 'dashboard-service-hosting' }">
          <span class="icon-back"></span>
        </NuxtLink>
        <h4>{{ websiteStore.active.name }}</h4>
        <div class="text-sm">
          <n-space v-if="websiteStore.active.bucket_uuid" align="center" size="small" :wrap="false">
            <span>{{ $t('storage.bucket.uuid') }}:</span>
            <n-ellipsis class="text-body align-bottom" :line-clamp="1">
              {{ websiteStore.active.bucket_uuid }}
            </n-ellipsis>
            <button class="text-body" @click="copyToClipboard(websiteStore.active.bucket_uuid)">
              <span class="icon-copy"></span>
            </button>
          </n-space>
          <n-space
            v-if="websiteStore.active.website_uuid"
            align="center"
            size="small"
            :wrap="false"
          >
            <span>{{ $t('hosting.website.uuid') }}:</span>
            <n-ellipsis class="text-body align-bottom" :line-clamp="1">
              {{ websiteStore.active.website_uuid }}
            </n-ellipsis>
            <button class="text-body" @click="copyToClipboard(websiteStore.active.website_uuid)">
              <span class="icon-copy"></span>
            </button>
          </n-space>
        </div>
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
