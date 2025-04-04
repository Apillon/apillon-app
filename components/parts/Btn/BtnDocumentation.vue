<template>
  <Btn
    type="secondary"
    class="!px-2"
    inner-class="text-white flex items-center justify-center"
    :class="{ 'locked rounded-lg transition-colors hover:bg-bg-lighter': hoverLighter }"
  >
    <span class="icon-file mr-2 text-xl text-yellow"></span>
    <slot>
      <span>{{ $t('dashboard.viewDocumentation') }}</span>
    </slot>
  </Btn>
</template>
<script lang="ts" setup>
defineProps({
  hoverLighter: { type: Boolean, default: false },
});
</script>
