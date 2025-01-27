<template>
  <div class="card-light relative flex flex-col justify-between p-8">
    <div>
      <div class="mb-4 flex items-center gap-2">
        <NuxtIcon v-if="service.iconSvg" class="text-2xl" :name="service.iconSvg" />
        <span v-else class="text-2xl" :class="service.icon"></span>
        <h5>{{ service.name }}</h5>
      </div>
      <p class="whitespace-break-spaces">
        {{ service.description }}
      </p>
    </div>
    <div>
      <div v-if="service.usage && !hideUsage" class="my-8 flex flex-wrap gap-2">
        <Pill v-for="(item, key) in service.usage" :key="key" type="info">
          {{ item }}
        </Pill>
      </div>
      <slot />
    </div>
    <div v-if="service.disabled" class="absolute bottom-full right-0">
      <span class="text-[10px] uppercase">
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
