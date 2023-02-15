<template>
  <div v-bind="$attrs">
    <div class="body-sm mb-2">
      <strong>{{ $t('hosting.domain.preview') }}</strong>
    </div>
    <n-space class="w-full" :wrap="!isLg" align="center">
      <HostingPreviewLink v-if="domain" :link="`https://${domain}`" />
      <Btn type="primary" size="small" @click="showModalDomain = true">
        <span v-if="domain">
          {{ $t('hosting.domain.setup') }}
        </span>
        <span v-else>{{ $t('hosting.domain.add') }}</span>
      </Btn>
      <Btn type="secondary" size="small" @click="showModalConfiguration = true">
        {{ $t('hosting.domain.configure') }}
      </Btn>
    </n-space>
  </div>
  <!-- Modal - Website domain -->
  <modal
    v-model:show="showModalDomain"
    class="!w-auto"
    :title="domain ? $t('hosting.domain.update') : $t('hosting.domain.add')"
  >
    <FormHostingDomain
      :website-id="websiteId"
      :domain="domain"
      @submit-success="showModalDomain = false"
    />
  </modal>

  <!-- Modal - Website domain configuration -->
  <modal
    v-model:show="showModalConfiguration"
    class="!w-auto"
    title="How to setup a domain for Apillon hosting?"
  >
    <HostingDomainConfiguration />
  </modal>
</template>

<script lang="ts" setup>
const { isLg } = useScreen();
const { params } = useRoute();
const dataStore = useDataStore();
const showModalDomain = ref<boolean>(false);
const showModalConfiguration = ref<boolean>(false);
const websiteId = ref<number>(parseInt(`${params?.slug}`));

const domain = computed<string>(() => {
  return dataStore.website.active.domain;
});
</script>
