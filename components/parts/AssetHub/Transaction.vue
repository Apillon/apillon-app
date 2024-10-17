<template>
  <Modal v-model:show="modalTransactionVisible" class="text-center">
    <IconSuccessful class="text-4xl" />

    <h2 class="mt-6 mb-2">
      {{ $t('dashboard.service.assetHub.transactionProcessed') }}
    </h2>
    <i18n-t keypath="dashboard.service.assetHub.transactionDetails" tag="p">
      <a :href="link" class="link" target="_blank">{{ $t('general.here') }}</a>
    </i18n-t>

    <Btn
      type="secondary"
      class="w-full mt-8"
      @click="
        () => {
          modalTransactionVisible = false;
          $emit('close');
        }
      "
    >
      {{ $t('general.close') }}
    </Btn>
  </Modal>
</template>

<script lang="ts" setup>
defineEmits(['close']);
defineProps({
  link: { type: String, required: true },
});

const i18n = useI18n();
const modalTransactionVisible = ref<boolean>(true);
</script>
