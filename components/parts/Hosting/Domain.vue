<template>
  <div v-bind="$attrs">
    <div class="body-sm mb-1">
      <strong>{{ $t('hosting.domain.preview') }}</strong>
    </div>

    <div v-if="domain" class="flex flex-wrap mb-4 gap-4 gap-y-6 items-center">
      <HostingPreviewLink :link="`https://${domain}`" />
      <div v-if="domainStatus" class="flex gap-3 items-center flex-wrap sm:flex-nowrap mb-2">
        <div class="body-sm">
          <strong class="whitespace-nowrap">{{ $t('hosting.domain.domainStatus') }}:</strong>
        </div>
        <Pill :type="domainStatusType">
          {{ $t(`hosting.domain.status.${domainStatus.domainStatus}`) }}
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

    <n-space class="w-full" :wrap="!isLg" align="center">
      <Btn v-if="editEnabled" type="primary" size="small" @click="showModalDomain = true">
        <span v-if="domain">
          {{ $t('hosting.domain.setup') }}
        </span>
        <span v-else>{{ $t('hosting.domain.add') }}</span>
      </Btn>
      <n-tooltip v-else placement="top" trigger="hover">
        <template #trigger>
          <Btn type="primary" size="small" class="cursor-default !bg-primary/50 locked">
            <span v-if="domain">
              {{ $t('hosting.domain.setup') }}
            </span>
            <span v-else>{{ $t('hosting.domain.add') }}</span>
          </Btn>
        </template>
        <span>{{ $t('hosting.domain.editDisabled') }}</span>
      </n-tooltip>

      <Btn type="secondary" size="small" @click="showModalConfiguration = true">
        {{ $t('hosting.domain.configure') }}
      </Btn>
    </n-space>
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
const { isLg } = useScreen();
const websiteStore = useWebsiteStore();
const { websiteUuid } = useHosting();

const showModalDomain = ref<boolean>(false);
const showModalConfiguration = ref<boolean>(false);
const domainStatus = ref<DomainInterface | null>(null);
const loadingDomain = ref<boolean>(false);
const btnDomainDisabled = ref<boolean>(false);

onMounted(async () => {
  await websiteStore.getWebsites();
  refreshDomainStatus();
});

const domain = computed<string>(() => {
  return websiteStore.active.domain || '';
});

const domainStatusType = computed<TagType>(() => {
  switch (domainStatus.value?.domainStatus) {
    case WebsiteDomainStatus.PENDING:
      return 'info';
    case WebsiteDomainStatus.INVALID:
      return 'error';
    default:
      return 'success';
  }
});

const editEnabled = computed<boolean>(() => {
  const time = websiteStore.active.domainChangeDate;
  return time && domain.value ? new Date(time).getTime() + 15 * 60 * 1000 < Date.now() : true;
});

async function refreshDomainStatus() {
  if (domain.value) {
    loadingDomain.value = true;
    btnDomainDisabled.value = true;
    domainStatus.value = await websiteStore.fetchDomainStatus(websiteUuid.value);
    loadingDomain.value = false;
    setTimeout(() => (btnDomainDisabled.value = false), 5000);
  }
}
</script>
