<template>
  <Dashboard>
    <template #heading>
      <n-space :size="24" align="center" class="h-12">
        <h4 class="">{{ $t('dashboard.attachNewService') }}</h4>
        <div class="w-[1px] h-[13px] bg-grey-light"></div>
        <strong class="body-sm">{{ $t('dashboard.learnMoreAboutServices') }}</strong>
      </n-space>
    </template>
    <template v-if="showServices" #learn>
      <LearnAlert>
        Click on a service you want to attach to your project. After configuring it, the service
        will become operational.
        <strong>Keep in mind, you can always edit the attached services or add new ones.</strong>
      </LearnAlert>
      <LearnVideo />
      <LearnClientLibraries />
    </template>
    <slot>
      <div v-if="showServices">
        <h6 class="mb-6">{{ $t('dashboard.selectServices') }}</h6>
        <div class="grid gap-4 grid-cols-services">
          <div
            v-for="(service, key) in services"
            :key="key"
            class="py-6 px-[22px] bg-grey-lightBg shadow-black"
            :class="{ 'text-grey': service.disabled }"
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
              :disabled="service.disabled"
              @click="attachService = service.id"
            >
              <span v-if="attachService === service.id">{{ $t('dashboard.attached') }}</span>
              <span v-else>{{ $t('dashboard.attachService') }}</span>
            </Btn>
          </div>
        </div>
        <Notification class="mt-5">
          Authentication service was successfully attached. Below enter the name and select desired
          network.
        </Notification>
        <Notification type="info" class="mt-5">
          Authentication service was successfully attached. Below enter the name and select desired
          network.
        </Notification>
        <Notification type="warning" class="mt-5">
          Authentication service was successfully attached. Below enter the name and select desired
          network.
        </Notification>
        <Notification type="error" class="mt-5">
          Authentication service was successfully attached. Below enter the name and select desired
          network.
        </Notification>
        <FormAttachService
          v-if="attachService"
          :service-type="attachService"
          class="max-w-[520px] mt-5"
        />
      </div>
      <div v-else class="flex items-center justify-between max-w-3xl bg-grey-lightBg px-6 py-4">
        <div>
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
import { ServiceTypeItem } from '~~/types/service';
import { randomInteger } from '~~/lib/utils';

useHead({
  title: 'Dashboard',
});

const showServices = ref(false);
const attachService = ref(null);

const services: Array<ServiceTypeItem> = [
  {
    id: ServiceType.AUTHENTICATION,
    name: 'authentication',
    icon: 'icon-authentication',
  },
  {
    id: ServiceType.STORAGE,
    name: 'storage',
    icon: 'icon-storage',
    new: true,
  },
  {
    id: ServiceType.COPMUTING,
    name: 'computing',
    icon: 'icon-computing',
    disabled: true,
  },
];
</script>
