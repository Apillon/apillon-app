<template>
  <Btn
    type="secondary"
    inner-class="text-white flex items-center justify-center"
    :class="{ 'locked hover:bg-bg-lighter rounded-lg transition-colors': hoverLighter }"
  >
    <span class="icon-file text-xl mr-2"></span>
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
