<template>
  <Modal v-model:show="modalVisible" class="hide-header text-center">
    <AnimationLoader class="scale-40" />

    <h2 class="mb-2 mt-6">
      {{ $t('assetHub.assetCreating') }}
    </h2>
    <p>{{ $t('assetHub.assetCreatingWait') }}</p>
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
