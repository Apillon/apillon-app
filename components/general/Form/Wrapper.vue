<template>
  <div class="form-wrapper w-full flex gap-8 tablet:flex-wrap">
    <div class="w-full lg:w-1/4">
      <h4>{{ title }}</h4>
    </div>

    <div class="w-full lg:w-1/2">
      <div class="max-w-lg">
        <slot />
      </div>
    </div>

    <div class="w-full lg:w-1/4"></div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  title: { type: String, default: '' },
});
</script>

<style lang="postcss">
.form-wrapper + .form-wrapper {
  @apply pt-8 border-t-1 border-bg-lighter;
}
</style>
