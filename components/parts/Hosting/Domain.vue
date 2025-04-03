<template>
  <div v-bind="$attrs">
    <div v-if="domain" class="body-sm mb-1">
      <strong>{{ $t('hosting.domain.preview') }}</strong>
    </div>

    <div v-if="domain" class="mb-4 flex flex-wrap items-center gap-4 gap-y-6">
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

    <n-space v-if="domain" class="w-full" :wrap="!isLg" align="center">
      <Btn type="primary" @click="showModalConfiguration = true">
        {{ $t('hosting.domain.configure') }}
      </Btn>

      <Btn type="error" :loading="loadingDelete" @click="deleteDomain">
        {{ $t('hosting.domain.remove') }}
      </Btn>
    </n-space>
    <Btn v-else-if="editEnabled" type="primary" @click="showModalDomain = true">
      {{ $t('hosting.domain.add') }}
    </Btn>
    <n-tooltip v-else placement="top" :trigger="isMd ? 'hover' : 'click'">
      <template #trigger>
        <Btn type="primary" class="locked cursor-default !bg-primary/50">
          {{ $t('hosting.domain.add') }}
        </Btn>
      </template>
      <span>{{ $t('hosting.domain.editDisabled') }}</span>
    </n-tooltip>
  </div>
  <!-- Modal - Website domain -->
  <modal
    v-model:show="showModalDomain"
    class="!w-auto max-w-[100vw] md:min-w-[38rem]"
    :title="domain ? $t('hosting.domain.update') : $t('hosting.domain.add')"
  >
    <FormHostingDomain :website-uuid="websiteUuid" :domain="domain" />
  </modal>

  <!-- Modal - Website domain configuration -->
  <modal
    v-model:show="showModalConfiguration"
    class="!w-auto max-w-[100vw]"
    title="How to setup a domain for Apillon hosting?"
  >
    <HostingDomainConfiguration />
  </modal>
</template>

<script lang="ts" setup>
const { isMd, isLg } = useScreen();
const websiteStore = useWebsiteStore();
const { websiteUuid } = useHosting();
const { deleteItem } = useDelete();

const showModalDomain = ref<boolean>(false);
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

const editEnabled = computed<boolean>(() => {
  const time = websiteStore.active.domainChangeDate;
  return !time || new Date(time).getTime() + 15 * 60 * 1000 < Date.now();
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
