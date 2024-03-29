<template>
  <div class="relative card-light flex flex-col justify-between p-8">
    <div class="mb-8">
      <div class="flex items-center gap-2 mb-4">
        <span class="text-2xl" :class="service.icon"></span>
        <h5>{{ service.name }}</h5>
      </div>
      <p>
        {{ service.description }}
      </p>
    </div>
    <div>
      <div v-if="service.usage" class="flex flex-wrap gap-2 mb-8">
        <Pill v-for="(item, key) in service.usage" :key="key" type="info">
          {{ item }}
        </Pill>
      </div>
      <slot />
    </div>
    <div v-if="service.disabled" class="absolute right-0 bottom-full">
      <span class="uppercase text-[10px]">
        {{ $t('general.comingSoon') }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  service: { type: Object as PropType<ServiceTypeItem>, required: true },
  hideUsage: { type: Boolean, default: false },
});
</script>
