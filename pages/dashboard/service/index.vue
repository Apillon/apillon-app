<template>
  <Dashboard :loading="false">
    <template #heading>
      <Heading>
        <slot>
          <h3>{{ $t('dashboard.nav.services') }}</h3>
        </slot>
      </Heading>
    </template>
    <slot>
      <div class="pb-8">
        <div class="max-w-lg mb-8">
          <p class="text-body">{{ $t('dashboard.service.description') }}</p>
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <div
            v-for="(service, key) in services"
            :key="key"
            class="card-light flex flex-col justify-between p-8 md:min-h-[24rem]"
          >
            <div class="mb-8">
              <div class="flex items-center gap-2 mb-4">
                <span class="text-2xl" :class="service.icon"></span>
                <h5>{{ $t(`dashboard.service.${service.name}.name`) }}</h5>
              </div>
              <p class="text-body">
                {{ $t(`dashboard.service.${service.name}.description`) }}
              </p>
            </div>
            <div>
              <div class="flex flex-wrap gap-2 mb-8">
                <Pill v-for="(item, key) in service.usage" :key="key" type="info">
                  {{ item }}
                </Pill>
              </div>
              <Btn
                size="large"
                type="primary"
                :disabled="service.disabled || false"
                :to="{ name: service.link }"
              >
                {{ $t('auth.onboarding.getStarted') }}
              </Btn>
            </div>
          </div>
        </div>
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
type ServiceTypeItem = {
  id: number;
  name: string;
  icon: string;
  link: string;
  disabled?: boolean | null;
  usage: String[];
};
const { t } = useI18n();
useHead({
  title: t('dashboard.nav.services'),
});

const authStore = useAuthStore();

const services: Array<ServiceTypeItem> = [
  {
    id: ServiceType.STORAGE,
    name: 'storage',
    icon: 'icon-storage',
    link: 'dashboard-service-storage',
    disabled: !isFeatureEnabled(Feature.STORAGE, authStore.getUserRoles()),
    usage: translateItems('dashboard.service.storage.usage'),
  },
  {
    id: ServiceType.HOSTING,
    name: 'hosting',
    icon: 'icon-hosting',
    link: 'dashboard-service-hosting',
    disabled: !isFeatureEnabled(Feature.HOSTING, authStore.getUserRoles()),
    usage: translateItems('dashboard.service.hosting.usage'),
  },
  {
    id: ServiceType.AUTHENTICATION,
    name: 'authentication',
    icon: 'icon-authentication',
    link: 'dashboard-service-authentication',
    disabled: !isFeatureEnabled(Feature.AUTHENTICATION, authStore.getUserRoles()),
    usage: translateItems('dashboard.service.authentication.usage'),
  },
  {
    id: ServiceType.COMPUTING,
    name: 'computing',
    icon: 'icon-computing',
    link: 'dashboard-service-computing',
    disabled: !isFeatureEnabled(Feature.COMPUTING, authStore.getUserRoles()),
    usage: translateItems('dashboard.service.computing.usage'),
  },
];
</script>
