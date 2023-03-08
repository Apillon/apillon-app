<template>
  <Dashboard :loading="false">
    <template #heading>
      <n-space :size="24" align="center" class="h-12">
        <h4 class="">{{ $t('dashboard.attachNewService') }}</h4>
        <div class="w-[1px] h-[13px] bg-white"></div>
        <strong class="body-sm">{{ $t('dashboard.learnMoreAboutServices') }}</strong>
      </n-space>
    </template>
    <template
      v-if="showServices || !isFeatureEnabled(Feature.SERVICES, authStore.getUserRoles())"
      #learn
    >
    </template>
    <slot>
      <div v-if="showServices && isFeatureEnabled(Feature.SERVICES, authStore.getUserRoles())">
        <h6 class="mb-6">{{ $t('dashboard.selectServices') }}</h6>
        <div class="grid gap-4 grid-cols-services">
          <div
            v-for="(service, key) in services"
            :key="key"
            class="py-6 px-[22px] bg-bg-lighter shadow-black"
            :class="{ 'text-body': service.disabled }"
          >
            <div class="text-2xl">
              <span :class="service.icon"></span>
              <span
                v-if="service.new"
                class="icon-new float-right text-blue text-2xl"
                :class="`animation-new-${randomInteger(0, 3)}`"
              ></span>
            </div>
            <h4>{{ $t(`service.${service.name}.name`) }}</h4>
            <p class="mb-5">
              {{ $t(`service.${service.name}.description`) }}
            </p>
            <Btn
              class="w-full"
              :type="attachService === service.id ? 'secondary' : 'primary'"
              :disabled="service.disabled || false"
              @click="attachService = service.id"
            >
              <span v-if="attachService === service.id">{{ $t('dashboard.attached') }}</span>
              <span v-else>{{ $t('dashboard.attachService') }}</span>
            </Btn>
          </div>
        </div>

        <FormService v-if="attachService" :service-type="attachService" class="max-w-lg mt-5" />
      </div>
      <div
        v-else-if="isFeatureEnabled(Feature.SERVICES, authStore.getUserRoles())"
        class="flex flex-col md:flex-row items-center justify-between max-w-3xl bg-bg-lighter px-6 py-4"
      >
        <div class="mb-4 md:mb-0">
          <p class="body-lg font-bold">Your project currently has no active service</p>
          <p class="body-sm">
            First attach a desired service and configure it, then start building.
          </p>
        </div>
        <div>
          <Btn type="primary" @click="showServices = !showServices"> Attach a service </Btn>
        </div>
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
useHead({
  title: 'Dashboard',
});

const authStore = useAuthStore();
const showServices = ref(false);
const attachService = ref<number>();

const services: Array<ServiceTypeItem> = [
  {
    id: ServiceType.AUTHENTICATION,
    name: 'authentication',
    icon: 'icon-authentication',
    disabled: !isFeatureEnabled(Feature.AUTHENTICATION, authStore.getUserRoles()),
  },
  {
    id: ServiceType.STORAGE,
    name: 'storage',
    icon: 'icon-storage',
    new: true,
    disabled: !isFeatureEnabled(Feature.STORAGE, authStore.getUserRoles()),
  },
  {
    id: ServiceType.COPMUTING,
    name: 'computing',
    icon: 'icon-computing',
    disabled: !isFeatureEnabled(Feature.COMPUTING, authStore.getUserRoles()),
  },
];
</script>
