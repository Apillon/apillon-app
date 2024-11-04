<template>
  <div class="w-full h-full flex flex-col justify-evenly gap-8 pb-8">
    <div class="flex justify-center">
      <NuxtIcon name="nft/illustration" class="icon-auto w-full max-w-xs" filled />
    </div>
    <div class="flex justify-around gap-8">
      <div class="max-w-md text-center">
        <h4>{{ $t('nft.metadata.static.title') }}</h4>
        <p class="mt-4 mb-8">{{ $t('nft.metadata.static.content') }}</p>
        <Btn>{{ $t('nft.metadata.static.btn') }}</Btn>
      </div>
      <div class="max-w-md text-center">
        <h4>{{ $t('nft.metadata.dynamic.title') }}</h4>
        <p class="mt-4 mb-8">{{ $t('nft.metadata.dynamic.content') }}</p>
        <Btn>{{ $t('nft.metadata.dynamic.btn') }}</Btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const collectionStore = useCollectionStore();

function onStaticSelect() {
  collectionStore.form.base.useIpns = false;
}
function onDynamicSelect() {
  collectionStore.form.base.useIpns = true;
}
</script>
