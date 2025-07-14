<template>
  <div v-if="loading" class="relative pb-10 pt-20">
    <Spinner />
  </div>
  <div v-else>
    <Notification v-if="dataStore.isProjectUser" type="error" class="mb-8 w-full">
      {{ $t('dashboard.permissions.insufficient') }}
    </Notification>
    <Notification v-else-if="disabled" type="warning" class="mb-4">
      {{ $t('service.quotaReached') }},
      <NuxtLink class="text-yellow" :to="{ name: 'dashboard-payments' }"> {{ $t('project.upgradePlan') }} </NuxtLink>.
    </Notification>

    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});
const dataStore = useDataStore();
</script>
