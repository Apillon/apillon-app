<template>
  <div class="flex h-full w-full flex-col justify-evenly gap-8 pb-8 text-center">
    <div class="flex justify-center">
      <NuxtIcon name="nft/illustration" class="icon-auto" filled />
    </div>
    <div class="flex justify-around gap-8">
      <div class="flex max-w-md flex-col items-center justify-between">
        <div>
          <h4>{{ $t('nft.metadata.static.title') }}</h4>
          <p class="mb-8 mt-4">{{ $t('nft.metadata.static.content') }}</p>
        </div>
        <Btn @click="onSelect(false)">{{ $t('nft.metadata.static.btn') }}</Btn>
      </div>
      <div class="flex max-w-md flex-col items-center justify-between">
        <div>
          <h4>{{ $t('nft.metadata.dynamic.title') }}</h4>
          <p class="mb-8 mt-4">{{ $t('nft.metadata.dynamic.content') }}</p>
        </div>
        <Btn @click="onSelect(true)">{{ $t('nft.metadata.dynamic.btn') }}</Btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['submit']);
const metadataStore = useMetadataStore();

function onSelect(value: boolean) {
  metadataStore.form.smartContract.useIpns = value;
  emit('submit');
}
</script>
