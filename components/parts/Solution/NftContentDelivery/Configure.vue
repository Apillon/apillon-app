<template>
  <div class="max-w-2xl">
    <div v-if="step === EncryptConfigureTab.BASE">
      <h3 class="mt-4 mb-8">{{ $t('dashboard.solution.encryption.configure.formName') }}</h3>
      <FormComputingContractBase @submit-success="step = EncryptConfigureTab.NFT_COLLECTION" />
    </div>
    <div v-else>
      <h3 class="my-4">{{ $t('dashboard.solution.encryption.configure.nftCollection') }}</h3>
      <p class="mb-8">{{ $t('dashboard.solution.encryption.configure.nftCollectionInfo') }}</p>
      <FormComputingContractNftCollection @submit-success="$emit('proceed')" />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineEmits(['back', 'change', 'proceed']);
const step = ref(EncryptConfigureTab.BASE);
</script>
