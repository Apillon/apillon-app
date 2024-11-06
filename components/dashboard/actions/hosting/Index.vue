<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="min-w-[11rem] w-[20vw] max-w-xs">
      <n-input
        v-model:value="websiteStore.search"
        type="text"
        name="search"
        size="small"
        :placeholder="$t('general.search')"
        clearable
      >
        <template #prefix>
          <span class="icon-search text-2xl"></span>
        </template>
      </n-input>
    </div>

    <n-space size="large">
      <!-- Modal Price list for Hosting -->
      <ModalCreditCosts :service="ServiceTypeName.HOSTING" />

      <!-- Refresh websites -->
      <n-button
        size="small"
        :loading="websiteStore.loading"
        @click="websiteStore.fetchWebsites(archive)"
      >
        <span class="icon-refresh text-xl mr-2"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Create new website -->
      <n-button
        v-if="websiteStore.hasWebsites"
        size="small"
        :disabled="authStore.isAdmin()"
        @click="showModalEditWebsite = true"
      >
        <span class="icon-create-folder text-xl text-primary mr-2"></span>
        <span class="text-primary">{{ $t('hosting.website.new') }}</span>
      </n-button>
    </n-space>
  </n-space>

  <!-- Modal - New website -->
  <modal
    v-model:show="showModalEditWebsite"
    :title="$t('hosting.website.new')"
    :service-name="PriceServiceName.HOSTING_WEBSITE"
  >
    <FormHostingWebsite />
  </modal>
</template>

<script lang="ts" setup>
defineProps({
  archive: { type: Boolean, default: false },
});

const authStore = useAuthStore();
const websiteStore = useWebsiteStore();
const showModalEditWebsite = ref<boolean>(false);
</script>
