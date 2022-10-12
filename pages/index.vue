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
              <span v-if="service.new" class="icon-new float-right text-blue text-2xl"></span>
            </div>
            <h4>{{ $t(`service.${service.name}.name`) }}</h4>
            <p class="mb-5">
              {{ $t(`service.${service.name}.description`) }}
            </p>
            <Btn class="w-full" :disabled="service.disabled">
              {{ $t('dashboard.attachService') }}
            </Btn>
          </div>
        </div>
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
import { NSpace } from 'naive-ui';
import { ServiceInterface } from '~~/types/service';

useHead({
  title: 'Dashboard',
});

const showServices = ref(false);

const services: Array<ServiceInterface> = [
  {
    name: 'authentication',
    icon: 'icon-authentication',
  },
  {
    name: 'storage',
    icon: 'icon-storage',
    new: true,
  },
  {
    name: 'computing',
    icon: 'icon-computing',
    disabled: true,
  },
];
</script>
<style lang="postcss">
.icon-new {
  animation-duration: resolve(floor(random() * 100 + 1));
}
</style>
