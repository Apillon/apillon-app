<template>
  <Dashboard>
    <template #heading>
      <Heading>
        <slot>
          <div class="flex gap-4 items-center">
            <NuxtLink :to="{ name: 'dashboard-service-asset-hub' }">
              <span class="icon-back text-2xl align-sub"></span>
            </NuxtLink>
            <div>
              <h2>{{ $t('dashboard.service.assetHub.form.create') }}</h2>
            </div>
          </div>
        </slot>
      </Heading>
    </template>

    <div>
      <FormAssetHubNew />
    </div>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
</script>
