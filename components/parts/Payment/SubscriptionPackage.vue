<template>
  <div class="card-dark p-8">
    <h3 class="mb-2">{{ subscriptionPackage.name }}</h3>
    <p class="text-body mb-6">
      {{ subscriptionPackage.description }}
    </p>
    <Btn type="primary" @click="getSubscriptionSessionUrl(subscriptionPackage.id)"> Buy </Btn>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  subscriptionPackage: {
    type: Object as VuePropType<SubscriptionPackageInterface>,
    required: true,
  },
});

const paymentStore = usePaymentsStore();

async function getSubscriptionSessionUrl(packageId: number) {
  const sessionUrl = await paymentStore.fetchSubscriptionSessionUrl(packageId);
  console.log(sessionUrl);
}
</script>
