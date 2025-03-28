<template>
  <div
    class="w-full"
    :class="{ 'flex flex-col justify-between': showFooter }"
    :style="showFooter ? 'min-height: calc(100dvh - 280px)' : ''"
  >
    <div :class="{ 'flex items-center justify-center': showFooter }">
      <div class="mx-auto w-full max-w-lg text-center">
        <NuxtIcon name="nft/collection" class="icon-auto mb-4 flex justify-center" filled />
        <h2>{{ $t('nft.collection.created.title') }}</h2>
        <p class="mb-2 whitespace-pre-line text-body">
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
        <Btn
          v-if="[1284, 1287, 529].includes($props.chain ?? 0)"
          type="primary"
          size="large"
          @click="modalDeployWebsiteVisible = true"
        >
          {{ $t('nft.collection.created.deploy') }}
        </Btn>
        <template v-if="showFooter">
          <SeparatorText class="my-4" :border-left="true">
            {{ $t('general.or') }}
          </SeparatorText>
          <NuxtLink :to="backLink">
            <Btn type="secondary" size="large">
              {{ $t('nft.collection.created.goBack') }}
            </Btn>
          </NuxtLink>
        </template>

        <slot />
      </div>
    </div>
    <div v-if="showFooter" class="relative mt-8 border-t-1 border-bg-lighter px-5 py-6">
      <IconInfo v-if="$te('w3Warn.nft.new')" class="absolute left-0 top-4" @click="modalW3WarnVisible = true" />
      <p class="mb-2 text-center text-body">
        <span class="mx-1 inline-block">{{ $t('nft.collection.created.view') }}</span>
        <a
          :href="transactionLink(collectionStore.active.transactionHash, collectionStore.active.chain)"
          target="_blank"
        >
          <Btn type="builders" size="tiny">
            <span class="text-sm">{{ $t('nft.collection.created.explorer') }}</span>
          </Btn>
        </a>
        <span class="mx-1 inline-block">{{ $t('nft.collection.created.or') }}</span>

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
    <modal v-model:show="modalDeployWebsiteVisible" :title="$t('nft.collection.created.deploy')">
      <FormNftWebsiteDeploy @submit-success="modalDeployWebsiteVisible = false" />
    </modal>
  </div>
</template>

<script setup lang="ts">
import { transactionLink } from '~/lib/utils/chain';

defineProps({ showFooter: { type: Boolean, default: false }, chain: { type: Number, default: 0 } });

const collectionStore = useCollectionStore();
const { loadingBucket, openBucket } = useStorage();
const modalDeployWebsiteVisible = ref<boolean>(false);

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
