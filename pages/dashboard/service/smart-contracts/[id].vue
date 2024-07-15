<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderSmartContractsSecondary />
    </template>

    <slot>
      <div>
        <div class="grid md:grid-cols-2 gap-8 border-b border-bg-lighter pb-8 mb-8">
          <div>
            <SolutionContent :content="content" :icons="true" />
            <Btn type="primary">
              {{ $t('dashboard.smartContracts.customizeAndDeploy') }}
            </Btn>
          </div>

          <!-- DEMO -->
          <Demo
            :image="NftTemplateJPG"
            link="https://github.com/Apillon/ps-signup-email-airdrop"
            :title="$t('dashboard.solution.viewCode')"
          />
        </div>
      </div>

      <div>
        <h4>Smart Contract Details</h4>
        <SmartContractsSubMenu />
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import NftTemplateJPG from '~/assets/images/solution/ps-signup-email-airdrop.png';

const router = useRouter();
const { params } = useRoute();
const { t } = useI18n();
const { generateContent } = useSolution();
const smartContractsStore = useSmartContractsStore();

const pageLoading = ref<boolean>(true);
const dataStore = useDataStore();

const content = generateContent(SolutionKey.SMART_CONTRACT);
const contractUuid = ref<string>(`${params?.id}` || `${params?.slug}` || '');
const smartContractDetails = ref<SmartContractInterface | null>(null);

useHead({
  title: t('dashboard.solution.nftEmailSignupAirdrop.name'),
});

onMounted(() => {
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    console.log('contractUuid', contractUuid.value);

    if (!contractUuid.value) {
      router.push({ name: 'dashboard-service-computing' });
    } else {
      await smartContractsStore.getContractByUUID(contractUuid.value);

      smartContractDetails.value = smartContractsStore.getContractDetails;
      pageLoading.value = false;
    }
  });
});
</script>
