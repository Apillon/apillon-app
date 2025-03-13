<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] min-w-[11rem] max-w-xs">
      <FormFieldSearch v-model:value="websiteStore.search" />
    </div>

    <n-space size="large">
      <!-- Modal Price list for Hosting -->
      <ModalCreditCosts :service="ServiceTypeName.HOSTING" />

      <!-- Refresh websites -->
      <n-button size="small" :loading="websiteStore.loading" @click="websiteStore.fetchWebsites(archive)">
        <span class="icon-refresh mr-2 text-xl"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Create new website -->
      <n-button
        v-if="websiteStore.hasWebsites"
        size="small"
        :disabled="authStore.isAdmin()"
        @click="showModalEditWebsite = true"
      >
        <span class="icon-create-folder mr-2 text-xl text-primary"></span>
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
import { ServiceTypeName, PriceServiceName } from '~/lib/types/service';

defineProps({
  archive: { type: Boolean, default: false },
});

const authStore = useAuthStore();
const websiteStore = useWebsiteStore();
const showModalEditWebsite = ref<boolean>(false);
</script>
