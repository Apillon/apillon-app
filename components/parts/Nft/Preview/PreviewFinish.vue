<template>
  <div
    class="w-full"
    :class="{ 'flex flex-col justify-between': showFooter }"
    :style="showFooter ? 'min-height: calc(100dvh - 280px)' : ''"
  >
    <div :class="{ 'flex justify-center items-center': showFooter }">
      <div class="w-full max-w-lg text-center mx-auto">
        <NuxtIcon name="nft/collection" class="flex justify-center icon-auto mb-4" filled />
        <h2>{{ $t('nft.collection.created.title') }}</h2>
        <p class="mb-2 text-body whitespace-pre-line">
          {{ $t('nft.collection.created.info') }}
        </p>

        <div class="mb-2 flex items-center justify-center text-body">
          <p>{{ $t('nft.collection.createToDisplay') }}&nbsp;</p>
          <a href="https://github.com/Apillon/nft-template-vue/fork" target="_blank">
            <Btn type="builders" size="tiny"> Vue </Btn>
          </a>
          <p>,&nbsp;</p>
          <a href="https://github.com/Apillon/nft-template-react/fork" target="_blank">
            <Btn type="builders" size="tiny"> React </Btn>
          </a>
          <p>&nbsp;{{ $t('general.or') }}&nbsp;</p>
          <a href="https://github.com/Apillon/nft-template/fork" target="_blank">
            <Btn type="builders" size="tiny"> javascript template </Btn>
          </a>
          <p>.</p>
        </div>
        <template v-if="showFooter">
          <SeparatorText class="my-4" :border-left="true">
            {{ $t('general.or') }}
          </SeparatorText>
          <NuxtLink :to="backLink">
            <Btn type="primary" size="large">
              {{ $t('nft.collection.created.goBack') }}
            </Btn>
          </NuxtLink>
        </template>
      </div>
    </div>
    <div v-if="showFooter" class="relative border-t-1 border-bg-lighter py-6 px-5 mt-8">
      <IconInfo
        v-if="$te('w3Warn.nft.new')"
        class="absolute top-4 left-0"
        @click="modalW3WarnVisible = true"
      />
      <p class="mb-2 text-center text-body">
        <span class="inline-block mx-1">{{ $t('nft.collection.created.view') }}</span>
        <a
          :href="
            transactionLink(collectionStore.active.transactionHash, collectionStore.active.chain)
          "
          target="_blank"
        >
          <Btn type="builders" size="tiny">
            <span class="text-sm">{{ $t('nft.collection.created.explorer') }}</span>
          </Btn>
        </a>
        <span class="inline-block mx-1">{{ $t('nft.collection.created.or') }}</span>

        <Btn
          type="builders"
          size="tiny"
          :loading="loadingBucket"
          @click="openBucket(collectionStore.active.bucket_uuid || '')"
        >
          <span class="text-sm">{{ $t('nft.collection.created.bucket') }}</span>
        </Btn>
      </p>
    </div>
    <W3Warn v-model:show="modalW3WarnVisible">
      {{ $t('w3Warn.nft.new') }}
    </W3Warn>
  </div>
</template>

<script setup lang="ts">
defineProps({ showFooter: { type: Boolean, default: false } });

const collectionStore = useCollectionStore();
const { loadingBucket, openBucket } = useStorage();

const modalW3WarnVisible = ref<boolean>(false);

const backLink = computed(() =>
  collectionStore.active?.collection_uuid
    ? {
        name: 'dashboard-service-nft-id',
        params: { id: collectionStore.active?.collection_uuid },
      }
    : { name: 'dashboard-service-nft' }
);
</script>
