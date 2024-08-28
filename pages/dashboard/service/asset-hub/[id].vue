<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <div class="flex gap-4 items-center">
            <NuxtLink :to="{ name: 'dashboard-service-asset-hub' }">
              <span class="icon-back text-2xl align-sub"></span>
            </NuxtLink>
            <div>
              <h2>{{ $t('dashboard.service.assetHub.asset') }}</h2>
            </div>
          </div>
        </slot>
      </Heading>
    </template>

    <div class="flex w-full max-w-[1200px] gap-8 justify-between"></div>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
useHead({
  title: $i18n.t('dashboard.nav.assetHub'),
});

const pageLoading = ref<boolean>(true);

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      pageLoading.value = false;
    });
  }, 100);
});
</script>
