<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <h1>{{ $t('dashboard.nav.authentication') }}</h1>
        </slot>

        <template #info>
          <n-space :size="32" align="center">
            <IconInfo v-if="$i18n.te('w3Warn.auth.new')" @click="showModalW3Warn = true" />
          </n-space>
        </template>
      </Heading>
    </template>
    <slot>
      <TableServices v-if="dataStore.hasServices()" :service-type="ServiceType.AUTHENTICATION" />
      <Empty
        v-else
        :title="$t('service.authentication.emptyTitle')"
        :info="$t('service.authentication.emptyInfo')"
        icon="storage/empty"
      >
        <Btn type="primary" @click="createNewService">
          {{ $t('service.addFirst') }}
        </Btn>
      </Empty>

      <W3Warn v-model:show="showModalW3Warn" @submit="onModalW3WarnHide">
        {{ $t('w3Warn.auth.new') }}
      </W3Warn>

      <!-- Modal - Create Service -->
      <modal v-model:show="showModalNewService" :title="$t('service.new')">
        <FormService
          :service-type="ServiceType.AUTHENTICATION"
          @submit-success="showModalNewService = false"
        />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const dataStore = useDataStore();
const pageLoading = ref<boolean>(true);
const showModalW3Warn = ref<boolean>(false);
const showModalNewService = ref<boolean | null>(false);

useHead({
  title: $i18n.t('dashboard.nav.authentication'),
});

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await dataStore.getServices();
      pageLoading.value = false;
    });
  }, 100);
});

/**
 * On createNewService click
 * If W3Warn has already been shown, show modal create new service, otherwise show warn first
 * */
function createNewService() {
  if (sessionStorage.getItem(LsW3WarnKeys.AUTH_NEW) || !$i18n.te('w3Warn.auth.new')) {
    showModalNewService.value = true;
  } else {
    showModalW3Warn.value = true;
    showModalNewService.value = null;
  }
}

/** When user close W3Warn, allow him to create new service */
function onModalW3WarnHide() {
  if (showModalNewService.value !== false) {
    showModalNewService.value = true;
  }
}

/** Watch showModalNewService, onShow update timestamp of shown modal in session storage */
watch(
  () => showModalW3Warn.value,
  shown => {
    if (shown) {
      sessionStorage.setItem(LsW3WarnKeys.AUTH_NEW, Date.now().toString());
    }
  }
);
</script>
