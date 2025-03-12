<template>
  <div v-bind="$attrs">
    <div v-if="domain" class="body-sm mb-1">
      <strong>{{ $t('hosting.domain.preview') }}</strong>
    </div>

    <div v-if="domain" class="flex flex-wrap mb-4 gap-4 gap-y-6 items-center">
      <HostingPreviewLink :link="`https://${domain}`" />
      <div class="flex gap-3 items-center flex-wrap sm:flex-nowrap mb-2">
        <div class="body-sm">
          <strong class="whitespace-nowrap">{{ $t('hosting.domain.domainStatus') }}:</strong>
        </div>
        <Pill :type="domainStatusType">
          {{ $t(`hosting.domain.status.${domainStatus || 0}`) }}
        </Pill>
        <n-button
          size="small"
          :disabled="btnDomainDisabled"
          :loading="loadingDomain"
          @click="refreshDomainStatus"
        >
          <span class="icon-refresh text-xl mr-2"></span>
          {{ $t('hosting.domain.refreshStatus') }}
        </n-button>
      </div>
    </div>

    <n-space v-if="domain" class="w-full" :wrap="!isLg" align="center">
      <Btn type="primary" size="small" @click="showModalConfiguration = true">
        {{ $t('hosting.domain.configure') }}
      </Btn>

      <Btn type="error" size="small" :loading="loadingDelete" @click="deleteDomain">
        {{ $t('hosting.domain.remove') }}
      </Btn>
    </n-space>
    <Btn v-else-if="editEnabled" type="primary" size="small" @click="showModalDomain = true">
      {{ $t('hosting.domain.add') }}
    </Btn>
    <n-tooltip v-else placement="top" :trigger="isMd ? 'hover' : 'click'"">
      <template #trigger>
        <Btn type="primary" size="small" class="cursor-default !bg-primary/50 locked">
          {{ $t('hosting.domain.add') }}
        </Btn>
      </template>
      <span>{{ $t('hosting.domain.editDisabled') }}</span>
    </n-tooltip>
  </div>
  <!-- Modal - Website domain -->
  <modal
    v-model:show="showModalDomain"
    class="!w-auto md:min-w-[38rem] max-w-[100vw]"
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
