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
            v-for="(service, key) in web3Services"
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
                <template v-if="service.disabled"> {{ $t('general.comingSoon') }}</template>
                <template v-else> {{ $t('auth.onboarding.getStarted') }} </template>
              </Btn>
            </div>
          </div>
        </div>
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
useHead({
  title: t('dashboard.nav.services'),
});

const { web3Services } = useService();
</script>
