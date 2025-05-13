<template>
  <Modal v-model:show="modalTransactionVisible" class="hide-header text-center" :z-index="3000" :close-on-esc="false">
    <div class="-mt-20">
      <AnimationLoader class="scale-50" />
      <p class="-mt-10">{{ $t('assetHub.loadingTransaction') }}</p>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
defineEmits(['close']);

const modalTransactionVisible = ref<boolean>(true);
</script>
