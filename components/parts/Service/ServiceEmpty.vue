<template>
  <div class="mx-auto max-w-4xl pb-8">
    <div class="mb-12 flex gap-8">
      <div class="md:w-1/2">
        <h3>{{ $t(`dashboard.service.${name}.name`) }}</h3>
        <p class="my-4">{{ $t(`dashboard.service.${name}.description`) }}</p>

        <div class="mt-2 flex flex-wrap gap-2">
          <Tag
            v-for="(item, key) in translateItems(`dashboard.service.${service}.tags`)"
            :key="key"
            size="small"
            :type="item.includes('No code') ? 'success' : 'default'"
          >
            {{ item }}
          </Tag>
        </div>
      </div>
      <div class="card p-4 text-xs md:w-1/2">
        <div class="flex items-center justify-between">
          <small>{{ $t('dashboard.supported') }}</small>
          <NftChains :chains="enumKeys(EvmChainMainnet)" />
        </div>
        <hr class="my-4 w-full border-bg-lighter" />

        <div class="flex items-center justify-between">
          <small>{{ $t('dashboard.credits.pricing') }}</small>
          <div class="text-right">
            <p>
              <strong>{{ $t(`dashboard.service.${name}.pricing`) }}</strong>
            </p>

            <ModalCreditCosts :service="service" show-create-collection>
              <template #button>
                <span class="underline">{{ $t('dashboard.details') }} </span>
              </template>
            </ModalCreditCosts>
          </div>
        </div>
      </div>
    </div>

    <small>{{ $t('dashboard.introduction') }}</small>
    <n-card class="card-light mb-10 mt-2" size="medium">
      <div class="-my-2">
        <div class="flex justify-between gap-4">
          <div class="flex max-w-96 flex-col justify-evenly gap-6">
            <div class="px-4 text-hover">
              <strong>{{ $t('nft.collection.review.createCollection') }}</strong>
              <span class="mt-2 block">Import your NFT files and metadata with just few clicks.</span>
            </div>
            <div class="border-l-2 border-blue px-4">
              <strong>Add NFTs to Collection</strong>
              <span class="mt-2 block">Simplifies the onboarding process.</span>
            </div>
            <div class="px-4 text-hover">
              <strong>Mint your NFTs</strong>
              <span class="mt-2 block">Simplifies the onboarding process.</span>
            </div>
          </div>
          <div class="card card-lighter pb-9 pl-8 pt-8 text-right lg:w-[44%]">
            <NuxtIcon name="nft/new_collection" class="icon-auto ml-auto inline-block" filled />
          </div>
        </div>
        <hr class="my-4 w-full border-bg-lighter" />
        <div class="flex justify-between gap-4">
          <Btn class="no-underline" type="link" inner-class="flex gap-2 items-center" @click="showVideo = true">
            <span class="icon-video text-xl text-yellow"></span>
            <span class="text-white underline">{{ $t('dashboard.youTube.demo') }}</span>
          </Btn>

          <div class="flex justify-between gap-2">
            <BtnDocumentation v-if="docs" :href="docs" />
            <slot name="actions" />
          </div>
        </div>
      </div>
    </n-card>

    <small>{{ $t('general.learnMore') }}</small>
    <div class="mt-2 grid grid-cols-nft gap-4">
      <div v-for="(guide, key) in guides" :key="key" class="card-dark relative flex flex-col justify-between gap-4 p-4">
        <NuxtLink
          v-if="guide.link"
          :to="{ name: guide.link }"
          class="inline-flex-cc absolute right-4 top-4 h-5 w-5 -rotate-45 rounded-full transition-colors duration-300 hover:bg-bg-lighter"
        >
          <span class="icon-wide-right text-xl"></span>
        </NuxtLink>
        <div class="flex gap-2">
          <Tag v-for="(item, key2) in guide.tags" :key="key2" size="small" type="info">
            {{ item }}
          </Tag>
        </div>

        <div class="flex items-center justify-between text-white">
          <strong>{{ guide.title }}</strong>
        </div>
        <div>
          <p class="text-xs text-white-secondary">{{ guide.content }}</p>
        </div>
      </div>
    </div>

    <ModalYT v-model:show="showVideo" :video-id="videoId" :chapters="videoChapters" />
  </div>
</template>

<script lang="ts" setup>
import { enumKeys, translateItems } from '~/lib/utils';
import { EvmChainMainnet } from '~/lib/types/nft';
import type { ServiceTypeName } from '~/lib/types/service';

defineProps({
  name: { type: String, required: true },
  service: { type: String as PropType<ServiceTypeName>, required: true },
  docs: { type: String, default: null },
  videoId: { type: String, default: null },
  videoChapters: { type: Array<VideoChapter>, default: null },
});

const showVideo = ref<boolean>(false);

const guides = [
  {
    tags: ['Guide'],
    title: 'Generate NFT art (with AI) and get files ready',
    content: 'You will learn how to prepare files and metadata for a smooth deployment of your NFTs.',
    link: 'dashboard-service',
  },
  {
    tags: ['Guide'],
    title: 'Generate NFT art (with AI) and get files ready',
    content: 'You will learn how to prepare files and metadata for a smooth deployment of your NFTs.',
    link: 'dashboard-service',
  },
  {
    tags: ['Guide'],
    title: 'Generate NFT art (with AI) and get files ready',
    content: 'You will learn how to prepare files and metadata for a smooth deployment of your NFTs.',
    link: 'dashboard-service',
  },
];
</script>
