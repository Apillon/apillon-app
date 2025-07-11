<template>
  <div class="relative flex flex-col justify-between gap-4 p-8" :class="[dark ? 'card-dark' : 'card-light']">
    <div :class="{ 'opacity-60': service.disabled }">
      <div class="mb-4 flex gap-2" :class="[titleNewLine ? 'flex-col' : 'flex-row items-center']">
        <NuxtIcon v-if="service.iconSvg" class="text-2xl" :name="service.iconSvg" />
        <span v-else class="text-2xl" :class="service.icon"></span>
        <h5>{{ service.name }}</h5>
      </div>
      <p class="whitespace-break-spaces" v-html="service.description"></p>
      <div v-if="service.usage && !hideUsage" class="my-2 flex flex-wrap gap-2">
        <Tag v-for="(item, key) in service.usage" :key="key" :type="item.includes('No code') ? 'success' : 'default'">
          {{ item }}
        </Tag>
      </div>
    </div>
    <div v-if="$slots.default" :class="{ 'opacity-60': service.disabled }">
      <slot />
    </div>
    <div v-if="service.disabled" class="flex-cc absolute left-0 top-0 h-full w-full backdrop-blur-sm">
      <Tag type="info" filled>
        <template v-if="comingSoon">{{ comingSoon }}</template>
        <template v-else> {{ $t('general.comingSoon') }}</template>
      </Tag>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  service: { type: Object as PropType<ServiceTypeItem>, required: true },
  comingSoon: { type: String, default: '' },
  dark: { type: Boolean, default: false },
  hideUsage: { type: Boolean, default: false },
  titleNewLine: { type: Boolean, default: false },
});
</script>
