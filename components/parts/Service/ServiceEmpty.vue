<template>
  <div class="mx-auto max-w-4xl">
    <div class="mb-12 flex gap-8">
      <div class="md:w-1/2">
        <h3>{{ $t('dashboard.service.nft.name') }}</h3>
        <p class="my-4">{{ $t('dashboard.service.nft.description') }}</p>

        <div class="mt-2 flex flex-wrap gap-2">
          <Tag
            v-for="(item, key) in tags"
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
              <strong>Depends on chain (500-1000 credits)</strong>
            </p>
            <span class="underline">See details </span>
            <ModalCreditCosts :service="ServiceTypeName.NFT" filter-by-chain />
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
              <strong>Create Collection</strong>
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
            <BtnDocumentation href="https://wiki.apillon.io/web3-services/4-nfts.html" />
            <Btn>{{ $t('dashboard.startBuilding') }}</Btn>
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
          <Tag v-for="(item, key) in guide.tags" :key="key" size="small" type="info">
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

    <ModalYT
      v-model:show="showVideo"
      video-id="qQJnuvUo-xo"
      :chapters="[
        { time: '00:00', title: 'Intro' },
        { time: '00:35', title: 'Dashboard' },
        { time: '02:53', title: 'NFT Collection' },
        { time: '05:20', title: 'Minting' },
        { time: '07:15', title: 'Website' },
      ]"
    />
  </div>
</template>

<script lang="ts" setup>
import { enumKeys } from '~/lib/utils';
import { EvmChainMainnet } from '~/lib/types/nft';
import { ServiceTypeName } from '~/lib/types/service';

const { t } = useI18n();
const tags = ['No code required', 'API', 'SDK', 'CLI'];
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
