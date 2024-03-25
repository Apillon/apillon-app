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
          <SolutionContent :content="content">
            <Btn type="primary" :to="{ name: 'dashboard-solution-nft-collection-new' }">
              {{ $t('general.customizeDeploy') }}
            </Btn>
          </SolutionContent>

          <SolutionDemo :img="NftTemplateJPG" />
        </div>

        <div class="max-w-lg mb-8">
          <h4>{{ $t('dashboard.solutions.includedWeb3Services') }}</h4>
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <Card v-for="(service, key) in nftServices" :key="key" :service="service" />
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

const content = generateContent(SolutionKey.NFT_COLLECTION);
const nftServices = web3Services.filter(item => item.id !== ServiceType.AUTHENTICATION);
</script>
