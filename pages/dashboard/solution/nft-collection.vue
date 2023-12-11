<template>
  <Dashboard :loading="false">
    <template #heading>
      <Heading>
        <slot>
          <h3>{{ $t('dashboard.solutions.nftCollection.name') }}</h3>
        </slot>
      </Heading>
    </template>
    <slot>
      <div class="pb-8">
        <div class="grid md:grid-cols-2 gap-8 border-b border-bg-lighter pb-8 mb-8">
          <div class="">
            <h4>How does it work?</h4>
            <p class="text-body">
              Launch your end-to-end decentralized NFT collection with one click. Create NFTs,
              deploy smart contract and host the collection website on Web3.
            </p>
            <ul class="my-6">
              <li v-for="(item, key) in benefits" :key="key" class="my-2">
                <NuxtIcon
                  name="icon/success"
                  class="inline-block float-left mr-2 text-2xl text-green"
                />
                <span>{{ item }}</span>
              </li>
            </ul>
            <Btn type="primary" :to="{ name: 'dashboard-service-nft-new' }">
              Customize and deploy
            </Btn>
          </div>
          <div class="flex justify-center">
            <div class="relative rounded-lg overflow-hidden">
              <Image :src="NftTemplateJPG" width="514" height="320" alt="nft template" />
              <div class="absolute left-0 right-0 top-0 bottom-0 flex-cc bg-bg-dark/75">
                <Btn type="info" size="small">
                  <strong class="body-sm">View demo</strong>
                </Btn>
              </div>
            </div>
          </div>
        </div>

        <div class="max-w-lg mb-8">
          <h4>{{ $t('dashboard.solutions.includedWeb3Services') }}</h4>
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <div
            v-for="(service, key) in nftServices"
            :key="key"
            class="card-light flex flex-col justify-between p-8 md:min-h-[20rem]"
          >
            <div class="mb-8">
              <div class="flex items-center gap-2 mb-4">
                <span class="text-2xl" :class="service.icon"></span>
                <h5>{{ $t(`dashboard.service.${service.name}.name`) }}</h5>
              </div>
              <p class="text-body">
                {{ $t(`dashboard.service.${service.name}.description`) }}
              </p>
            </div>
            <div>
              <div class="flex flex-wrap gap-2 mb-8">
                <Pill v-for="(item, key) in service.usage" :key="key" type="info">
                  {{ item }}
                </Pill>
              </div>
            </div>
          </div>
        </div>
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import NftTemplateJPG from '~/assets/images/nft/template.jpg';

const { t } = useI18n();
const { web3Services } = useService();

useHead({
  title: t('dashboard.nav.services'),
});

const nftServices = web3Services.filter(item => item.id !== ServiceType.AUTHENTICATION);

const benefits = ['Free metadata storage', '0 gas cost', 'Free web template', 'Free hosting'];
</script>
