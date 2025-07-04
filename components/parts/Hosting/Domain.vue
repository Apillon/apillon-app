<template>
  <div v-if="domain">
    <div class="body-sm mb-1">
      <strong>{{ $t('hosting.domain.preview') }}</strong>
    </div>

    <HostingPreviewLink :link="`https://${domain}`" />
    <div class="my-4 flex flex-wrap items-center gap-3">
      <div class="body-sm">
        <strong class="whitespace-nowrap">{{ $t('hosting.domain.domainStatus') }}:</strong>
      </div>
      <Pill :type="domainStatusType">
        {{ $t(`hosting.domain.status.${domainStatus || 0}`) }}
      </Pill>
    </div>

    <n-space class="w-full" :wrap="!isLg" align="center">
      <n-button :disabled="btnDomainDisabled" :loading="loadingDomain" @click="refreshDomainStatus">
        <span class="icon-refresh mr-2 text-xl"></span>
        {{ $t('hosting.domain.refreshStatus') }}
      </n-button>
      <Btn type="error" :loading="loadingDelete" @click="deleteDomain">
        {{ $t('hosting.domain.remove') }}
      </Btn>
    </n-space>
  </div>
  <FormHostingDomain v-else :website-uuid="uuid" :domain="domain" />
</template>

<script lang="ts" setup>
const props = defineProps({
  frontendUuid: { type: String, default: null },
});
const { isLg } = useScreen();
const websiteStore = useWebsiteStore();
const { websiteUuid } = useHosting();
const { deleteItem } = useDelete();

const domainStatus = ref<number | null>(null);
const loadingDomain = ref<boolean>(false);
const loadingDelete = ref<boolean>(false);
const btnDomainDisabled = ref<boolean>(false);

onMounted(() => {
  domainStatus.value = websiteStore.active.domainStatus;
});

const uuid = computed<string>(() => props.frontendUuid || websiteUuid.value);
const domain = computed<string>(() => websiteStore.active.domain || '');

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

    const websiteDomain = await websiteStore.fetchDomainStatus(uuid.value);
    if (websiteDomain) {
      domainStatus.value = websiteDomain.domainStatus;
    }
    loadingDomain.value = false;
    setTimeout(() => (btnDomainDisabled.value = false), 5000);
  }
}

async function deleteDomain() {
  loadingDelete.value = true;
  if (await deleteItem(ItemDeleteKey.DOMAIN, uuid.value)) {
    websiteStore.active.domain = null;
  }
  loadingDelete.value = false;
}
</script>
