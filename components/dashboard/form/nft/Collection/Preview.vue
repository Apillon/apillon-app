<template>
  <div class="max-w-xl">
    <div class="mb-4">
      <h2>{{ $t('nft.collection.preview') }}</h2>
      <p>
        {{ $t('nft.collection.previewInfo') }}
      </p>
    </div>
    <div class="mb-4 relative">
      <Image :src="createThumbnailUrl(collectionStore.form.base.coverImage)" class="h-50" />
      <Image
        :src="createThumbnailUrl(collectionStore.form.base.logo)"
        class="top-2 left-2 absolute h-20 border-2 border-bg-lighter"
      />
    </div>
    <div>
      <h4 class="mb-2">{{ $t('nft.collection.data') }}</h4>
      <div class="flex bg-bg-light py-2 px-4 rounded-md gap-3 w-max mb-4">
        <div class="grid gap-y-1">
          <span>{{ `${$t('form.label.collectionName')}:` }}</span>
          <span>{{ `${$t('form.label.collectionSymbol')}:` }}</span>
          <span>{{ `${$t('form.label.collectionChain')}:` }}</span>
          <span>{{ `${$t('form.label.collectionType')}:` }}</span>
          <span>{{ `${$t('form.label.collectionUseGateway')}:` }}</span>
        </div>
        <div class="grid gap-y-1">
          <span>{{ collectionStore.form.base.name }}</span>
          <span>{{ collectionStore.form.base.symbol }}</span>
          <span>{{ getChainName(collectionStore.form.base.chain) }}</span>
          <span>{{ getCollectionTypeName(collectionStore.form.base.collectionType) }}</span>
          <span>{{
            collectionStore.form.base.useApillonIpfsGateway
              ? $t('form.booleanSelect.true')
              : $t('form.booleanSelect.false')
          }}</span>
        </div>
      </div>
      <div class="mb-4">
        <h4 class="mb-2">{{ $t('nft.collection.behavior') }}</h4>
        <div class="flex bg-bg-light py-2 px-4 rounded-md gap-3 w-max">
          <div class="grid gap-y-1">
            <span>{{ `${$t('form.label.collectionSupplyLimited')}:` }}</span>
            <span>{{ `${$t('form.label.collectionMaxSupply')}:` }}</span>
            <span>{{ `${$t('form.label.collectionRevocable')}:` }}</span>
            <span>{{ `${$t('form.label.collectionSoulbound')}:` }}</span>
            <span>{{ `${$t('form.label.collectionRoyaltiesFees')}:` }}</span>
            <span>{{ `${$t('form.label.collectionRoyaltiesAddress')}:` }}</span>
            <span>{{ `${$t('form.label.collectionDrop')}:` }}</span>
            <span v-if="collectionStore.form.behavior.drop">{{
              `${$t('form.label.dropPrice')}:`
            }}</span>
            <span v-if="collectionStore.form.behavior.drop">{{
              `${$t('form.label.collectionDropStart')}:`
            }}</span>
            <span v-if="collectionStore.form.behavior.drop">{{
              `${$t('form.label.collectionDropReserve')}:`
            }}</span>
          </div>
          <div class="grid gap-y-1">
            <span>{{
              collectionStore.form.behavior.supplyLimited
                ? $t('form.supplyTypes.limited')
                : $t('form.supplyTypes.unlimited')
            }}</span>
            <span>{{
              collectionStore.form.behavior.maxSupply
                ? collectionStore.form.behavior.maxSupply
                : '-'
            }}</span>
            <span>{{
              collectionStore.form.behavior.revocable
                ? $t('form.booleanSelect.true')
                : $t('form.booleanSelect.false')
            }}</span>
            <span>{{
              collectionStore.form.behavior.soulbound
                ? $t('form.booleanSelect.true')
                : $t('form.booleanSelect.false')
            }}</span>
            <span>{{
              collectionStore.form.behavior.royaltiesFees
                ? collectionStore.form.behavior.royaltiesFees
                : '-'
            }}</span>
            <span>{{
              collectionStore.form.behavior.royaltiesAddress
                ? collectionStore.form.behavior.royaltiesAddress
                : '-'
            }}</span>
            <span>{{
              collectionStore.form.behavior.drop
                ? $t('form.booleanSelect.true')
                : $t('form.booleanSelect.false')
            }}</span>
            <span v-if="collectionStore.form.behavior.drop">{{
              collectionStore.form.behavior.dropPrice
            }}</span>
            <span v-if="collectionStore.form.behavior.drop">{{
              collectionStore.form.behavior.dropStart
            }}</span>
            <span v-if="collectionStore.form.behavior.drop">{{
              collectionStore.form.behavior.dropReserve
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const collectionStore = useCollectionStore();
const { collectionTypes, chains } = useCollection();

function createThumbnailUrl(file: FileListItemType): string {
  if (file.file) {
    return window.URL.createObjectURL(file.file);
  }
  return '';
}

function getCollectionTypeName(collectionType: Number) {
  return collectionTypes.find(type => type.value === collectionType).label;
}
function getChainName(collectionChain: Number) {
  return chains.find(chain => chain.value === collectionChain).label;
}
</script>
