<template>
  <div class="card-dark p-8">
    <h3 class="mb-2">{{ subscriptionPackage.name }}</h3>
    <p class="text-body mb-6">
      {{ subscriptionPackage.description }}
    </p>
    <Btn
      type="primary"
      :loading="loading"
      @click="getSubscriptionSessionUrl(subscriptionPackage.id)"
    >
      Buy
    </Btn>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  subscriptionPackage: {
    type: Object as VuePropType<SubscriptionPackageInterface>,
    required: true,
  },
});

const loading = ref<boolean>(false);
const paymentStore = usePaymentsStore();

async function getSubscriptionSessionUrl(packageId: number) {
  loading.value = true;
  const stripeSessionUrl = await paymentStore.fetchSubscriptionSessionUrl(packageId);
  loading.value = false;

  if (stripeSessionUrl) {
    window.open(stripeSessionUrl, '_self');
  }
}
</script>
