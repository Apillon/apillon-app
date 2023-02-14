<template>
  <Heading>
    <slot>
      <n-space align="center" :size="32">
        <NuxtLink :to="{ name: 'dashboard-service-hosting' }">
          <span class="icon-back"></span>
        </NuxtLink>
        <h4>{{ dataStore.webpage.active.name }}</h4>
        <div class="text-sm">
          <n-space align="center" size="small" :wrap="false">
            <span>{{ $t('storage.bucket.uuid') }}:</span>
            <n-ellipsis class="text-body align-bottom" :line-clamp="1">
              {{ dataStore.webpage.active.bucket_uuid }}
            </n-ellipsis>
            <button
              class="text-body"
              @click="copyToClipboard(dataStore.webpage.active.bucket_uuid)"
            >
              <span class="icon-copy"></span>
            </button>
          </n-space>
          <n-space
            v-if="dataStore.webpage.active.webpage_uuid"
            align="center"
            size="small"
            :wrap="false"
          >
            <span>{{ $t('hosting.webpage.uuid') }}:</span>
            <n-ellipsis class="text-body align-bottom" :line-clamp="1">
              {{ dataStore.webpage.active.webpage_uuid }}
            </n-ellipsis>
            <button
              class="text-body"
              @click="copyToClipboard(dataStore.webpage.active.webpage_uuid)"
            >
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
const dataStore = useDataStore();
</script>
