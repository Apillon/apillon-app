<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderSimplet :back="{ name: 'dashboard-simplet-list' }" :name="simpletStore.active.name" />
    </template>

    <n-space class="pb-8" :size="32" vertical>
      <div class="flex gap-8">
        <div>
          <div class="card-light flex-1 rounded-lg px-6 py-4">
            <SimpletInfo />
          </div>
          <Notification
            v-if="
              simpletStore.active.frontendStatus !== ResourceStatus.ONLINE &&
              !(websiteStore.active.domain || websiteStore.active.name)
            "
            type="warning"
            class="my-2"
          >
            {{ $t('simplet.wizard.deployingNotice') }}
          </Notification>
          <Notification
            v-else-if="
              !paymentStore.hasActiveSubscription &&
              Date.now() < addDays(new Date(simpletStore.active.createTime), 3).getTime()
            "
            type="warning"
            class="my-2"
          >
            <i18n-t keypath="simplet.trialInfo" tag="span">
              <span>
                {{ $t('general.until') }}
                <NuxtTime :datetime="addDays(new Date(simpletStore.active.createTime), 3)" date-style="long" />
              </span>
            </i18n-t>
            <i18n-t keypath="project.considerUpgrade" tag="span">
              <a href="/dashboard/payments" class="link" target="_blank">{{ $t('project.upgradingPlan') }}</a>
            </i18n-t>
          </Notification>
        </div>

        <div class="card max-w-64 px-6 py-4">
          <h6 class="mb-2">{{ $t('general.actions') }}</h6>
          <ActionsSimplet />
        </div>
      </div>
    </n-space>
  </Dashboard>
</template>

<script lang="ts" setup>
import { addDays } from 'date-fns';
const router = useRouter();
const paymentStore = usePaymentStore();
const simpletStore = useSimpletStore();
const websiteStore = useWebsiteStore();

const { t } = useI18n();
const { params } = useRoute();
const { checkUnfinishedSimplet } = useSimplet();

const pageLoading = ref<boolean>(true);

/** Simplet UUID from route */
const simpletUuid = ref<string>(`${params?.id}`);

useHead({
  title: t('dashboard.nav.simplets'),
});

onMounted(async () => {
  if (!params?.id) router.push({ name: 'dashboard-simplet' });

  await simpletStore.getSimplet(simpletUuid.value);
  if (!simpletStore.active?.simplet_uuid) {
    router.push({ name: 'dashboard-simplet' });
  }
  pageLoading.value = false;

  loadSimpletData();
  checkUnfinishedSimplet(() => loadSimpletData());
});

watch(
  () => simpletStore.active.frontendStatus,
  (status, oldStatus) => {
    if (status === ResourceStatus.ONLINE && oldStatus === ResourceStatus.DEPLOYING) {
      loadSimpletData();
    }
  }
);

const loadSimpletData = async () => {
  if (simpletStore.active.frontend_uuid) {
    websiteStore.fetchWebsite(simpletStore.active.frontend_uuid);
  }

  if (simpletStore.active.backend_uuid) {
    simpletStore.fetchBackend(simpletStore.active.backend_uuid);
  }
};
</script>
