<template>
  <Dashboard :loading="false">
    <template #heading>
      <Heading>
        <slot>
          <h3>{{ $t('dashboard.solution.openGov.name') }}</h3>
        </slot>
      </Heading>
    </template>
    <slot>
      <div class="pb-8">
        <p class="text-bold my-6">
          <strong>{{ $t('dashboard.solution.openGov.description') }}</strong>
        </p>
        <div class="mb-8 grid gap-8 border-b border-bg-lighter pb-8 md:grid-cols-2">
          <SolutionContent :content="content">
            <Btn type="primary" href="https://github.com/Apillon/ps-wasm-proposal-airdrop/fork">
              {{ $t('dashboard.solution.deploy') }}
            </Btn>
          </SolutionContent>

          <!-- DEMO -->
          <div class="flex h-fit justify-center">
            <div class="relative overflow-hidden rounded-lg">
              <Image :src="NftTemplateJPG" width="514" height="320" alt="nft template" />
              <div class="flex-cc absolute bottom-0 left-0 right-0 top-0 bg-bg-dark/75">
                <Btn type="info" size="small" href="https://github.com/Apillon/ps-wasm-proposal-airdrop">
                  <span class="icon-github mr-2"></span>
                  <strong class="body-sm"> {{ $t('dashboard.solution.viewCode') }}</strong>
                </Btn>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-8 max-w-lg">
          <h4>{{ $t('dashboard.solution.includedWeb3Services') }}</h4>
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
  title: t('dashboard.solution.openGov.name'),
});

const content = generateContent(SolutionKey.OPEN_GOV);
const nftServices = web3Services.filter(
  item => item.id === ServiceType.STORAGE || item.id === ServiceType.HOSTING || item.id === ServiceType.NFT
);
</script>
