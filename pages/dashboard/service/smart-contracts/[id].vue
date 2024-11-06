<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderSmartContract
        link="/dashboard/service/smart-contracts/new"
        :title="smartContractStore.active.name"
      />
    </template>

    <slot>
      <div>
        <div class="grid md:grid-cols-2 gap-8 border-b border-bg-lighter pb-8 mb-8">
          <div>
            <SolutionContent :content="content" :icons="true" />
            <Btn type="primary" :to="`/dashboard/service/smart-contracts/${params?.id}/deploy`">
              {{ $t('dashboard.service.smartContracts.customizeAndDeploy') }}
            </Btn>
          </div>

          <!-- DEMO -->
          <Demo
            :image="NftTemplateJPG"
            link="https://github.com/Apillon/apillon-evm-contracts"
            :title="$t('dashboard.solution.viewCode')"
          />
        </div>
      </div>

      <div v-if="smartContractStore.active?.contractVersion" class="pb-8">
        <h4>{{ $t('dashboard.service.smartContracts.details') }}</h4>
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

const { generateContent } = useSolution();
const content = generateContent(SolutionKey.SMART_CONTRACT);

useHead({
  title: t('dashboard.solution.nftEmailSignupAirdrop.name'),
});

onMounted(() => {
  init();
});
</script>
