<template>
  <Modal
    v-model:show="modalTransactionVisible"
    class="text-center hide-header"
    :z-index="3000"
    :close-on-esc="false"
  >
    <div class="-mt-20">
      <AnimationLoader class="scale-50" />
      <p class="-mt-10">{{ $t('dashboard.service.assetHub.loadingTransaction') }}</p>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
defineEmits(['close']);

const modalTransactionVisible = ref<boolean>(true);
</script>
