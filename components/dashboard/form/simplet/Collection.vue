<template>
  <div>
    <Headline
      class="!mb-6"
      :title="$t('simplet.wizard.collection.select')"
      :content="collections.length ? $t('simplet.wizard.collection.info') : $t('simplet.wizard.collection.empty')"
    />

    <Spinner v-if="collectionStore.loading" />
    <template v-else-if="collections.length">
      <hr class="my-5 border-bg-lighter" />
      <div class="my-6">
        <h6 class="mb-2">{{ $t('simplet.wizard.collection.add') }}</h6>
        <p class="mb-6">
          {{ $t('simplet.wizard.collection.addInfo') }}
          <Btn type="link" @click="openModalNft">
            <strong class="underline">{{ $t('dashboard.createHere') }}</strong>
          </Btn>
        </p>
        <FormFieldSearch v-model:value="search" :placeholder="$t('simplet.wizard.collection.search')" />
      </div>
      <CardSelect
        v-for="(collection, key) in collections"
        :key="key"
        :icon="collection.logoUrl ? undefined : 'menu/NFTs'"
        :img="collection.logoUrl || ''"
        :content="`${collection.maxSupply || '∞'} ${$t('nft.tokens')}`"
        :selected="selectedCollection?.collection_uuid === collection.collection_uuid"
        @click="selectedCollection = collection"
      >
        <template #title>
          <span>
            <strong>{{ collection.name }}</strong>
            <small class="capitalize"> ({{ chainIdToName(collection.chain) }})</small>
          </span>
        </template>
      </CardSelect>
    </template>
    <Notification v-else type="error" alert>
      {{ $t('simplet.wizard.collection.first') }}
      <Btn type="link" @click="openModalNft">
        <strong class="underline">{{ $t('dashboard.createHere') }}</strong>
      </Btn>
    </Notification>
  </div>
</template>

<script setup lang="ts">
defineExpose({ nextStep });

const { t } = useI18n();
const message = useMessage();
const simpletStore = useSimpletStore();
const metadataStore = useMetadataStore();
const collectionStore = useCollectionStore();

const search = ref<string>('');
const selectedCollection = ref<CollectionInterface>(collectionStore.active);

const collections = computed(() =>
  collectionStore.items.filter(
    c =>
      c.drop &&
      c.dropReserve > 0 &&
      [CollectionStatus.DEPLOYED, CollectionStatus.DEPLOYED].includes(c.collectionStatus) &&
      (simpletStore.form.type?.name !== SimpletName.AIRDROP || c.isAutoIncrement) &&
      (!search.value || c.name.toLowerCase().includes(search.value.toLowerCase()))
  )
);

onMounted(async () => {
  await collectionStore.getCollections();
});

function openModalNft() {
  metadataStore.resetForms();
  simpletStore.modalCreateVisible = false;
  setTimeout(() => (collectionStore.modalCreateVisible = true), 100);
}

function nextStep() {
  if (selectedCollection.value.collection_uuid) {
    simpletStore.form.collection = selectedCollection.value;
    simpletStore.form.collectionLogo = selectedCollection.value.logoUrl;
  } else {
    message.warning(t('simplet.wizard.selectCollection'));
  }
}
</script>
