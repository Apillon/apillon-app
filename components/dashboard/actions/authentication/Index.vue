<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="min-w-[11rem] w-[20vw] max-w-xs">
      <n-input
        v-model:value="dataStore.service.search"
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
      <!-- API Keys -->
      <NuxtLink :to="{ name: 'dashboard-api-keys' }">
        <n-button size="small">
          <span class="icon-acess text-xl mr-2"></span>
          {{ $t('dashboard.pageMenu.apiKeys') }}
        </n-button>
      </NuxtLink>

      <!-- Refresh websites -->
      <n-button
        size="small"
        :loading="dataStore.service.loading"
        @click="dataStore.fetchServices()"
      >
        <span class="icon-refresh text-xl mr-2"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Create new website -->
      <n-button size="small" @click="showModalNewService = true">
        <span class="icon-create-folder text-xl text-primary mr-2"></span>
        <span class="text-primary">{{ $t('dashboard.service.new') }}</span>
      </n-button>
    </n-space>
  </n-space>

  <!-- Modal - Create Service -->
  <modal v-model:show="showModalNewService" :title="$t('dashboard.service.new')">
    <FormService
      :service-type="ServiceType.AUTHENTICATION"
      @submit-success="showModalNewService = false"
    />
  </modal>
</template>

<script lang="ts" setup>
const dataStore = useDataStore();
const showModalNewService = ref<boolean | null>(false);
</script>
