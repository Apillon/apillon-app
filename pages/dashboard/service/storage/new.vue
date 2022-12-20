<template>
  <Dashboard>
    <template #heading>
      <BannerStorage />
    </template>
    <template #learn>
      <LearnAlert>
        Click on a service you want to attach to your project. After configuring it, the service
        will become operational.
        <strong>Keep in mind, you can always edit the attached services or add new ones.</strong>
      </LearnAlert>
      <LearnCollapse />
    </template>
    <slot>
      <n-space align="center" class="mb-6">
        <NuxtLink :to="{ name: 'dashboard-service-storage' }">
          <span class="icon-back"></span>
        </NuxtLink>
        <h5>{{ $t('storage.newBucket') }}</h5>
      </n-space>
      <FormStorageNew class="max-w-xl" />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

useHead({
  title: t('storage.newBucket'),
});
</script>
