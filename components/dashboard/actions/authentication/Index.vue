<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] min-w-[11rem] max-w-xs">
      <FormFieldSearch v-model:value="dataStore.service.search" />
    </div>

    <n-space size="large">
      <!-- API Keys -->
      <NuxtLink :to="{ name: 'dashboard-api-keys' }">
        <n-button size="medium">
          <span class="icon-acess mr-2 text-xl"></span>
          {{ $t('dashboard.pageMenu.apiKeys') }}
        </n-button>
      </NuxtLink>

      <!-- Refresh websites -->
      <n-button size="medium" :loading="dataStore.service.loading" @click="dataStore.fetchServices()">
        <span class="icon-refresh mr-2 text-xl"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Create new website -->
      <n-button size="medium" @click="showModalNewService = true">
        <span class="icon-create-folder mr-2 text-xl text-primary"></span>
        <span class="text-primary">{{ $t('dashboard.service.new') }}</span>
      </n-button>
    </n-space>
  </n-space>

  <!-- Modal - Create Service -->
  <modal v-model:show="showModalNewService" :title="$t('dashboard.service.new')">
    <FormService :service-type="ServiceType.AUTHENTICATION" @submit-success="showModalNewService = false" />
  </modal>
</template>

<script lang="ts" setup>
const dataStore = useDataStore();
const showModalNewService = ref<boolean | null>(false);
</script>
