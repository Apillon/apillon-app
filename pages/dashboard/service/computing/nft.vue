<template>
  <Dashboard :loading="false">
    <template #heading>
      <Heading>
        <slot>
          <h3>
            {{ $t('dashboard.solutions.nftContentDelivery.name') }}
          </h3>
        </slot>
      </Heading>
    </template>
    <slot>
      <div class="pb-8">
        <div class="grid md:grid-cols-2 gap-8 border-b border-bg-lighter pb-8 mb-8">
          <SolutionContent :content="content">
            <Btn type="primary" :to="{ name: 'dashboard-service-computing-new' }">
              {{ $t('general.customizeDeploy') }}
            </Btn>
          </SolutionContent>

          <div class="flex justify-center h-fit">
            <div class="relative rounded-lg overflow-hidden">
              <Image :src="NftTemplateJPG" width="514" height="320" alt="nft template" />
              <div class="absolute left-0 right-0 top-0 bottom-0 flex-cc bg-bg-dark/75">
                <Btn type="info" size="small">
                  <strong class="body-sm"> {{ $t('general.viewDemo') }}</strong>
                </Btn>
              </div>
            </div>
          </div>
        </div>

        <div class="max-w-lg mb-8">
          <h4>{{ $t('dashboard.solutions.includedWeb3Services') }}</h4>
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <Card v-for="(service, key) in nftServices" :key="key" :service="service" hide-usage />
        </div>
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import NftTemplateJPG from '~/assets/images/nft/template.jpg';

const { t } = useI18n();
const { web3Services } = useService();
const { generateContent } = useSolution();

useHead({
  title: t('dashboard.nav.services'),
});

const content = generateContent(SolutionKey.NFT_CONTENT_DELIVERY);
const nftServices = web3Services.filter(
  item =>
    item.id === ServiceType.COMPUTING ||
    item.id === ServiceType.NFT ||
    item.id === ServiceType.HOSTING
);
</script>
