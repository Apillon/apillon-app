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
              Customize and deploy
            </Btn>
          </SolutionContent>

          <SolutionDemo :img="NftTemplateJPG" />
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
              <p>
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
const { generateContent } = useSolution();

useHead({
  title: t('dashboard.nav.services'),
});

const content = generateContent(SolutionKey.NFT_COLLECTION);
const nftServices = web3Services.filter(item => item.id !== ServiceType.AUTHENTICATION);
</script>
