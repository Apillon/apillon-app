<template>
  <Modal v-model:show="modalVisible" class="text-center">
    <h2 class="mt-6 mb-2">
      {{ $t('dashboard.service.assetHub.leave.title') }}
    </h2>
    <p>{{ $t('dashboard.service.assetHub.leave.info') }}</p>

    <Btn type="primary" class="w-full mt-8">
      {{ $t('dashboard.service.assetHub.leave.anyway') }}
    </Btn>
    <Btn type="secondary" class="w-full mt-2" @click="modalVisible = false">
      {{ $t('form.cancel') }}
    </Btn>
  </Modal>
</template>

<script lang="ts" setup>
const modalVisible = ref<boolean>(true);
</script>
