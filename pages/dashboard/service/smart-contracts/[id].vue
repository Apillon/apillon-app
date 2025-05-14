<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderSmartContract link="/dashboard/service/smart-contracts/new" :title="smartContractStore.active.name" />
    </template>

    <slot>
      <div>
        <div class="mb-8 grid gap-8 border-b border-bg-lighter pb-8 md:grid-cols-2">
          <div>
            <SimpletContent :content="content" :icons="true" />
            <Btn type="primary" :to="`/dashboard/service/smart-contracts/${params?.id}/deploy`">
              {{ $t('smartContracts.customizeAndDeploy') }}
            </Btn>
          </div>

          <!-- DEMO -->
          <Demo
            :image="NftTemplateJPG"
            link="https://github.com/Apillon/apillon-evm-contracts"
            :title="$t('simplet.viewCode')"
          />
        </div>
      </div>

      <div v-if="smartContractStore.active?.contractVersion" class="pb-8">
        <h4>{{ $t('smartContracts.details') }}</h4>
        <SmartContractsSubMenu :abi="smartContractStore.active?.contractVersion?.abi" />
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import NftTemplateJPG from '~/assets/images/solution/ps-signup-email-airdrop.png';

const { t } = useI18n();
const { params } = useRoute();
const smartContractStore = useSmartContractStore();
const { pageLoading, init } = useSmartContracts();

const { generateContent } = useSimplet();
const content = generateContent('infoSection', 'smartContracts');

useHead({
  title: t('dashboard.nav.smartContracts'),
});

onMounted(() => {
  init();
});
</script>
