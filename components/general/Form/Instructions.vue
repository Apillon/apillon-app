<template>
  <div class="flex flex-wrap items-start justify-center gap-x-8 gap-y-4 self-stretch lg:flex-nowrap">
    <div
      v-bind="$attrs"
      class="card-dark mb-6 w-1/2 max-w-xl flex-auto rounded-lg p-4 pb-2 tablet:order-1 md:p-8 xl:max-w-2xl"
    >
      <div v-if="title" class="mb-4 flex justify-between">
        <h4>{{ title }}</h4>
        <div>
          <slot name="headerExtra" />
        </div>
      </div>
      <div>
        <slot />
      </div>
    </div>

    <div class="flex w-1/2 max-w-xl flex-auto flex-col gap-3 lg:flex-1 xl:max-w-2xl">
      <InfoBox v-for="(info, key) in instructions" :key="key" :content="info" />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  title: { type: String, default: '' },
  instructions: { type: Array<string>, default: [] },
});
</script>
