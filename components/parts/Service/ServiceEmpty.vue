<template>
  <div>
    <div class="flex gap-4">
      <div class="md:w-2/3">
        <h3>{{ $t('dashboard.service.nft.name') }}</h3>
        <p class="my-4">{{ $t('dashboard.service.nft.description') }}</p>

        <div class="mt-2 flex flex-wrap gap-2">
          <Tag
            v-for="(item, key) in tags"
            :key="key"
            size="small"
            :type="item.includes('No code') ? 'success' : 'default'"
          >
            {{ item }}
          </Tag>
        </div>
      </div>
      <div class="card md:w-1/3"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const tags = ['No code required', 'API', 'SDK', 'CLI'];
</script>
