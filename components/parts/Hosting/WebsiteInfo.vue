<template>
  <div class="flex h-full flex-col items-start justify-between gap-4 md:flex-row">
    <div class="relative w-1/4 overflow-hidden rounded border border-transparent bg-bg-lighter">
      <div class="min-h-24 bg-bg-dark">
        <Image :src="websiteStore.active?.image || ''" height="104" :alt="websiteStore.active.name" />
      </div>
      <div class="flex h-8 items-center px-2 py-1">
        <span class="text-xs capitalize">{{ websiteStore.active.name.replaceAll('-', ' ') }}</span>
      </div>
    </div>
    <n-table class="plain" :bordered="false" single-line>
      <tbody>
        <tr v-for="(item, key) in data" :key="key">
          <td :class="{ '!border-b-0': key + 1 === data.length }">
            <span class="text-white lg:whitespace-nowrap">{{ item.label }}</span>
          </td>
          <td :class="{ '!border-b-0': key + 1 === data.length }">
            <TableLink v-if="item.link && item.value" class="w-full" :link="item.link" :text="item.value" />
            <TableEllipsis v-else-if="item.copy" class="w-full justify-between" :text="item.value || ''" />
            <p v-else class="w-full">{{ item.value }}</p>
          </td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const websiteStore = useWebsiteStore();

const data = computed(() => {
  return [
    {
      label: t('nft.collection.name'),
      value: websiteStore.active.name,
    },
    {
      label: t('nft.collection.uuid'),
      value: websiteStore.active.website_uuid,
      copy: true,
    },
    {
      label: t('nft.collection.baseUri'),
      link: websiteStore.active.w3ProductionLink,
      value: websiteStore.active.w3ProductionLink,
      copy: true,
    },
  ];
});
</script>
