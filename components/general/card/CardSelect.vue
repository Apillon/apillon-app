<template>
  <div
    class="relative my-3 flex w-full cursor-pointer gap-4 rounded-md border p-4 text-sm transition-colors duration-300 hover:border-white"
    :class="[
      selected ? 'border-yellow' : disabled ? 'border-bodyDark' : 'border-bg-lighter',
      { '!cursor-default opacity-60': disabled },
    ]"
  >
    <span v-if="selected" class="absolute right-0 top-0 z-1 -translate-y-1/2 translate-x-1/2 bg-bg">
      <NuxtIcon name="icon/success" class="text-2xl text-yellow" filled />
    </span>
    <div v-if="iconClass || icon || img" class="flex-cc h-12 w-12 rounded bg-bg-light p-1">
      <NuxtIcon v-if="icon" :name="icon" class="icon-auto" filled />
      <span v-else-if="iconClass" class="text-2xl" :class="iconClass"></span>
      <Image v-else :src="img" alt="" />
    </div>

    <div class="flex w-full flex-col justify-evenly gap-2">
      <slot name="title">
        <strong>{{ title }}</strong>
      </slot>
      <div v-if="content || $slots.default" class="flex flex-col gap-1">
        <slot>
          <p class="text-xs text-white-secondary" v-html="content"></p>
        </slot>
        <slot name="additional" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  icon: { type: String, default: '' },
  iconClass: { type: String, default: '' },
  img: { type: String, default: '' },
  title: { type: String, default: '' },
  content: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  selected: { type: Boolean, default: false },
});
</script>
