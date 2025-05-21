<template>
  <Dashboard :loading="false">
    <template #heading>
      <Heading :headline="$t('dashboard.nav.services')" />
    </template>
    <slot>
      <div class="pb-8">
        <div class="mb-8 max-w-lg">
          <p>{{ $t('dashboard.service.description') }}</p>
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <Card v-for="(service, key) in web3Services" :key="key" :service="service">
            <Btn
              v-if="service.link"
              size="large"
              type="primary"
              :disabled="service.disabled || false"
              :to="{ name: service.link }"
            >
              <template v-if="service.disabled"> {{ $t('general.comingSoon') }}</template>
              <template v-else> {{ $t('auth.onboarding.getStarted') }} </template>
            </Btn>
          </Card>
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
