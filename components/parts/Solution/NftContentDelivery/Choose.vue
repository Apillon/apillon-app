<template>
  <div>
    <h2>{{ $t('dashboard.solution.choose') }}</h2>
    <p>
      {{ $t('dashboard.solution.chooseComputing') }}
    </p>

    <div class="grid gap-4 md:grid-cols-3 mt-8">
      <Card :service="serviceEncryption">
        <Btn
          size="large"
          type="primary"
          :disabled="serviceEncryption.disabled"
          @click="$emit('proceed')"
        >
          {{ $t('auth.onboarding.getStarted') }}
        </Btn>
      </Card>
      <Card :service="serviceNftContentDelivery">
        <Btn size="large" type="primary" :disabled="serviceNftContentDelivery.disabled">
          {{ $t('auth.onboarding.getStarted') }}
        </Btn>
      </Card>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
defineEmits(['back', 'change', 'proceed']);

const serviceEncryption = {
  id: SolutionKey.ENCRYPTION,
  key: 'encryption',
  name: t('dashboard.solution.encryption.name'),
  description: t('dashboard.solution.encryption.description'),
  icon: 'icon-storage',
  link: 'dashboard-service-storage',
  disabled: false,
};

const serviceNftContentDelivery = {
  id: SolutionKey.NFT_CONTENT_DELIVERY,
  key: 'nftContentDelivery',
  name: t('dashboard.solution.nftContentDelivery.name'),
  description: t('dashboard.solution.nftContentDelivery.description'),
  icon: 'icon-storage',
  link: 'dashboard-service-storage',
  disabled: true,
};
</script>
