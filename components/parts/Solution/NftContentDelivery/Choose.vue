<template>
  <div>
    <h2>Choose Solution</h2>
    <p>
      Select a computing template for your project. Deploy it on testnet to test it and fix if
      needed before launching in production on mainnet.
    </p>

    <div class="grid gap-4 md:grid-cols-3 mt-8">
      <Card :service="serviceEncryption">
        <Btn size="large" type="primary">{{ $t('auth.onboarding.getStarted') }} </Btn>
      </Card>
      <Card :service="serviceNftContentDelivery">
        <Btn size="large" type="primary">{{ $t('auth.onboarding.getStarted') }} </Btn>
      </Card>
    </div>
  </div>
</template>

<script lang="ts" setup>
const serviceEncryption = {
  id: ServiceType.COMPUTING,
  name: 'computing',
  icon: 'icon-storage',
};

const serviceNftContentDelivery = {
  id: ServiceType.COMPUTING,
  name: 'computing',
  icon: 'icon-storage',
};
</script>
