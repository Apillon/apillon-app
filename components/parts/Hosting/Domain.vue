<template>
  <div v-if="domain">
    <div class="body-sm mb-1">
      <strong>{{ $t('hosting.domain.preview') }}</strong>
    </div>

    <div class="mb-4 flex flex-wrap items-center gap-4 gap-y-6">
      <HostingPreviewLink :link="`https://${domain}`" />
      <div class="mb-2 flex flex-wrap items-center gap-3 sm:flex-nowrap">
        <div class="body-sm">
          <strong class="whitespace-nowrap">{{ $t('hosting.domain.domainStatus') }}:</strong>
        </div>
        <Pill :type="domainStatusType">
          {{ $t(`hosting.domain.status.${domainStatus || 0}`) }}
        </Pill>
        <n-button :disabled="btnDomainDisabled" :loading="loadingDomain" @click="refreshDomainStatus">
          <span class="icon-refresh mr-2 text-xl"></span>
          {{ $t('hosting.domain.refreshStatus') }}
        </n-button>
      </div>
    </div>

    <n-space class="w-full" :wrap="!isLg" align="center">
      <Btn type="primary" @click="showModalConfiguration = true">
        {{ $t('hosting.domain.configure') }}
      </Btn>

      <Btn type="error" :loading="loadingDelete" @click="deleteDomain">
        {{ $t('hosting.domain.remove') }}
      </Btn>
    </n-space>
    <!-- Modal - Website domain configuration -->
    <modal
      v-model:show="showModalConfiguration"
      class="!w-auto max-w-[100vw]"
      title="How to setup a domain for Apillon hosting?"
    >
      <HostingDomainConfiguration />
    </modal>
  </div>
  <FormHostingDomain v-else :website-uuid="websiteUuid" :domain="domain" />
</template>

<script lang="ts" setup>
const { isLg } = useScreen();
const websiteStore = useWebsiteStore();
const { websiteUuid } = useHosting();
const { deleteItem } = useDelete();

const showModalConfiguration = ref<boolean>(false);
const domainStatus = ref<number | null>(null);
const loadingDomain = ref<boolean>(false);
const loadingDelete = ref<boolean>(false);
const btnDomainDisabled = ref<boolean>(false);

onMounted(() => {
  domainStatus.value = websiteStore.active.domainStatus;
});

const domain = computed<string>(() => {
  return websiteStore.active.domain || '';
});

const domainStatusType = computed<TagType>(() => {
  switch (domainStatus.value) {
    case WebsiteDomainStatus.PENDING:
      return 'info';
    case WebsiteDomainStatus.OK:
      return 'success';
    case WebsiteDomainStatus.HAS_CDN:
      return 'success';
    default:
      return 'error';
  }
});

async function refreshDomainStatus() {
  if (domain.value) {
    loadingDomain.value = true;
    btnDomainDisabled.value = true;

    const websiteDomain = await websiteStore.fetchDomainStatus(websiteUuid.value);
    if (websiteDomain) {
      domainStatus.value = websiteDomain.domainStatus;
    }
    loadingDomain.value = false;
    setTimeout(() => (btnDomainDisabled.value = false), 5000);
  }
}

async function deleteDomain() {
  loadingDelete.value = true;
  if (await deleteItem(ItemDeleteKey.DOMAIN, websiteUuid.value)) {
    websiteStore.active.domain = null;
  }
  loadingDelete.value = false;
}
</script>
