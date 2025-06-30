<template>
  <div>
    <Headline
      class="!mb-6"
      :title="$t('simplet.wizard.collection.select')"
      :content="
        collections.length || search ? $t('simplet.wizard.collection.info') : $t('simplet.wizard.collection.empty')
      "
    />

    <template v-if="collections.length || collectionStore.loading || search">
      <hr class="my-5 border-bg-lighter" />
      <div class="my-6">
        <h6 class="mb-2">{{ $t('simplet.wizard.collection.add') }}</h6>
        <p class="mb-6">
          {{ $t('simplet.wizard.collection.addInfo') }}
          <Btn type="link" @click="openModalNft">
            <strong class="underline">{{ $t('dashboard.createHere') }}</strong>
          </Btn>
        </p>
        <div class="flex gap-4">
          <FormFieldSearch v-model:value="search" :placeholder="$t('simplet.wizard.collection.search')" />
          <n-button :loading="collectionStore.loading" @click="collectionStore.fetchCollections()">
            <span class="icon-refresh text-xl"></span>
          </n-button>
        </div>
      </div>
      <Spinner v-if="collectionStore.loading" />
      <template v-else>
        <CardSelect
          v-for="(collection, key) in collections"
          :key="key"
          :icon="collection.logoUrl ? undefined : 'menu/NFTs'"
          :img="collection.logoUrl || ''"
          :content="`${collection.maxSupply || '∞'} ${$t('nft.tokens')}`"
          :disabled="collection.collectionStatus < CollectionStatus.DEPLOYED"
          :selected="selectedCollection?.collection_uuid === collection.collection_uuid"
          @click="selectedCollection = collection"
        >
          <template #title>
            <span>
              <Spinner v-if="collection.collectionStatus < CollectionStatus.DEPLOYED" />
              <strong>{{ collection.name }}</strong>
              <small class="capitalize"> ({{ chainIdToName(collection.chain) }})</small>
            </span>
          </template>
        </CardSelect>
      </template>
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
const { checkUnfinishedCollections } = useCollection();

const search = ref<string>('');
const selectedCollection = ref<CollectionInterface>(collectionStore.active);

const collections = computed(() =>
  collectionStore.items.filter(
    c =>
      c.drop &&
      c.dropReserve > 0 &&
      c.collectionStatus > 0 &&
      c.collectionStatus <= CollectionStatus.DEPLOYED &&
      (simpletStore.form.type?.name !== SimpletName.AIRDROP || c.isAutoIncrement) &&
      (!search.value || c.name.toLowerCase().includes(search.value.toLowerCase()))
  )
);

onMounted(async () => {
  if (collections.value.length) {
    await collectionStore.getCollections();
  } else {
    await collectionStore.fetchCollections();
  }
  checkUnfinishedCollections();
});

function openModalNft() {
  metadataStore.resetForms();
  simpletStore.modalCreateVisible = false;
  setTimeout(() => (collectionStore.modalCreateVisible = true), 100);
}

function nextStep(): boolean {
  if (selectedCollection.value.collectionStatus < CollectionStatus.DEPLOYED) {
    message.warning(t('simplet.wizard.collection.deploying'));
  } else if (selectedCollection.value.collection_uuid) {
    simpletStore.form.collection = selectedCollection.value;
    simpletStore.form.collectionLogo = selectedCollection.value.logoUrl;
    return true;
  } else {
    message.warning(t('simplet.wizard.selectCollection'));
  }
  return false;
}
</script>
