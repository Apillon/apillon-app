<template>
  <Dashboard :loading="authStore.loadingProfile" :learn-collapsible="false">
    <template #heading>
      <Heading>
        <h1>{{ $t('dashboard.homepage') }}</h1>
      </Heading>
    </template>
    <slot>
      <div class="mb-8">
        <!-- Services-->
        <h4 class="mb-8">{{ $t('general.explore') }}</h4>

        <div class="grid md:grid-cols-3 gap-x-8 gap-y-4">
          <div
            v-for="(service, key) in services"
            :key="key"
            class="card-dark p-8 flex flex-col justify-between"
          >
            <div class="flex justify-between items-center text-white">
              <strong>{{ service.title }}</strong>
              <NuxtLink
                :to="{ name: service.link }"
                class="inline-flex-cc w-10 h-10 hover:bg-bg-lighter rounded-full transition-colors duration-300"
              >
                <span class="icon-wide-right text-xl"></span>
              </NuxtLink>
            </div>
            <div class="mt-4">
              <p>{{ service.content }}</p>
            </div>
          </div>
        </div>

        <hr class="border-bg-lighter my-8" />

        <!-- Resources-->
        <h4 class="mb-8">{{ $t('general.explore') }}</h4>

        <div class="grid lg:grid-cols-4 sm:grid-cols-2 gap-8">
          <div class="card-light p-8 flex flex-col justify-between">
            <div>
              <n-tag size="tiny" type="info" class="text-bg-dark" :bordered="false" round>
                {{ $t('dashboard.service.storage.bucket') }}
              </n-tag>
              <h5 class="mt-4">{{ $t('dashboard.service.storage.website') }}</h5>
            </div>
            <div class="mt-4">
              <StorageProgress
                :key="storageStore.info.usedStorage"
                :size="storageStore.info.usedStorage"
                :max-size="storageStore.info.availableStorage"
                wrap
              />
            </div>
          </div>

          <div class="card-dark-multiple">
            <div class="card-dark multiple p-8 flex flex-col justify-between">
              <div>
                <n-tag size="tiny" round>
                  {{ $t('dashboard.smartContracts.collection') }}
                </n-tag>
                <h5 class="mt-4">{{ $t('dashboard.smartContracts.meerkats') }}</h5>
              </div>
              <div class="flex gap-2 flex-wrap mt-4">
                <div class="w-10 h-10 flex-cc bg-blue rounded-full">
                  <span class="icon-storage text-2xl text-bg-dark"></span>
                </div>
                <div class="w-10 h-10 flex-cc bg-pink rounded-full">
                  <span class="icon-hosting text-2xl text-bg-dark"></span>
                </div>
                <div class="w-10 h-10 flex-cc bg-green rounded-full">
                  <span class="icon-erc-721 text-2xl text-bg-dark"></span>
                </div>
                <div class="w-10 h-10 flex-cc bg-bg-light rounded-full">
                  <strong>+2</strong>
                </div>
              </div>
            </div>
          </div>

          <div class="card-light p-8">
            <div class="flex justify-between items-center mb-4">
              <n-tag size="tiny" type="success" :bordered="false" round> ERC-721 </n-tag>
              <NuxtIcon name="logo/astar" class="text-3xl" filled />
            </div>
            <h5>{{ $t('dashboard.smartContracts.kraken') }}</h5>
          </div>

          <div class="card-light p-8 flex flex-col justify-between">
            <div>
              <n-tag size="tiny" type="error" class="text-bg-dark" :bordered="false" round>
                {{ $t('dashboard.service.storage.bucket') }}
              </n-tag>
              <h5 class="mt-4">{{ $t('dashboard.service.hosting.title') }}</h5>
            </div>
            <div class="mt-4">
              <StorageProgress
                :key="storageStore.info.usedStorage"
                :size="storageStore.info.usedStorage"
                :max-size="storageStore.info.availableStorage"
                wrap
              />
            </div>
          </div>
        </div>

        <hr class="border-bg-lighter my-8" />

        <!-- Activity-->
        <h4 class="mb-8">{{ $t('general.activity') }}</h4>

        <TablePaymentInvoices />
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const authStore = useAuthStore();
const paymentStore = usePaymentStore();
const storageStore = useStorageStore();

useHead({
  title: t('dashboard.dashboard'),
});

const services = [
  {
    title: t('dashboard.nav.services'),
    content: t('dashboard.service.info'),
    link: t('dashboard-service'),
  },
  {
    title: t('dashboard.nav.smartContracts'),
    content: t('dashboard.smartContracts.info'),
    link: t('dashboard-service'),
  },
  {
    title: t('dashboard.nav.solutions'),
    content: t('dashboard.solutions.info'),
    link: t('dashboard-solution'),
  },
];

onMounted(() => {
  paymentStore.getInvoices();
  storageStore.getStorageInfo();
});
</script>
