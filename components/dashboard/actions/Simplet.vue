<template>
  <div>
    <n-space class="w-full lg:min-w-52" size="large" vertical>
      <!-- Refresh -->
      <n-button class="w-full" size="medium" :loading="simpletStore.loading" @click="simpletStore.fetchSimplets()">
        {{ $t('general.refresh') }}
      </n-button>
    </n-space>

    <!-- Modal - Website under review -->
    <Modal v-model:show="modalWebsiteReviewVisible" :title="$t('hosting.review.title')">
      <p v-for="(item, key) in translateItems('hosting.review.content')" :key="key">
        {{ item }}
      </p>
      <div class="mt-8 grid w-full max-w-full grid-cols-1 gap-8">
        <Btn type="secondary" @click="">{{ $t('hosting.review.confirm') }}</Btn>
        <PaymentCardPlan :show-card="false" btn-type="primary" :btn-text="$t('hosting.review.upgrade')" />
      </div>
    </Modal>

    <!-- Modal -  Domain preview -->
    <Modal v-model:show="modalWebsiteDomainVisible" :title="$t('hosting.domain.edit')">
      <HostingDomain />
    </Modal>

    <!-- Modal - Delete Website -->
    <ModalDelete v-model:show="showModalDeleteWebsite" :title="$t('hosting.website.delete')">
      <FormDelete :id="simpletStore.active?.simplet_uuid" :type="ItemDeleteKey.WEBSITE" @submit-success="" />
    </ModalDelete>
  </div>
</template>

<script lang="ts" setup>
const { isMd } = useScreen();
const { subscriptionMessage } = usePayment();

const { t, te } = useI18n();
const message = useMessage();
const authStore = useAuthStore();
const dataStore = useDataStore();
const simpletStore = useSimpletStore();

const modalWebsiteReviewVisible = ref<boolean>(false);
const modalWebsiteDomainVisible = ref<boolean>(false);
const modalGithubConfigVisible = ref<boolean>(false);
const modalVariablesVisible = ref<boolean>(false);
const showModalDeleteWebsite = ref<boolean>(false);

const deploying = ref<boolean>(false);

const editDomainEnabled = computed<boolean>(() => {
  const time = simpletStore.active?.domainChangeDate;
  return !time || new Date(time).getTime() + 15 * 60 * 1000 < Date.now();
});

/** Show payment messages if user create subscription */
onMounted(async () => {
  await dataStore.waitOnPromises();
  subscriptionMessage();
});
</script>
