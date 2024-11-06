<template>
  <Modal v-model:show="modalVisible" class="text-center hide-header">
    <AnimationLoader class="scale-40" />

    <h2 class="mt-6 mb-2">
      {{ $t('dashboard.service.assetHub.assetCreating') }}
    </h2>
    <p>{{ $t('dashboard.service.assetHub.assetCreatingWait') }}</p>
    <i18n-t keypath="dashboard.service.assetHub.assetCreatingInfo" tag="p">
      <a :href="link" class="link" target="_blank">{{ $t('general.here') }}</a>
    </i18n-t>
  </Modal>
</template>

<script lang="ts" setup>
defineProps({
  link: { type: String, required: true },
});
const modalVisible = ref<boolean>(true);
</script>
