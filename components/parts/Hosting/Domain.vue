<template>
  <div v-bind="$attrs">
    <div class="body-sm mb-2">
      <strong>{{ $t('hosting.domain.preview') }}</strong>
    </div>
    <n-space class="w-full" :wrap="!isLg" align="center">
      <HostingPreviewLink v-if="domain" :link="`https://${domain}`" />

      <Btn v-if="editEnabled || true" type="primary" size="small" @click="showModalDomain = true">
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
const showModalDomain = ref<boolean>(false);
const showModalConfiguration = ref<boolean>(false);
const { websiteUuid } = useHosting();

onMounted(() => {
  websiteStore.getWebsites();
});

const domain = computed<string>(() => {
  return websiteStore.active.domain || '';
});

const editEnabled = computed<boolean>(() => {
  const time = websiteStore.active.domainChangeDate;
  return time && domain.value ? new Date(time).getTime() + 15 * 60 * 1000 < Date.now() : true;
});
</script>
