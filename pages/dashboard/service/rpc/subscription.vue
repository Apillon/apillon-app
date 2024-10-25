<template>
  <Dashboard>
    <template #heading>
      <Heading>
        <slot>
          <h1>{{ t('dashboard.nav.rpc') }}</h1>
        </slot>
      </Heading>
    </template>

    <slot>
      <div class="mb-6">
        <div class="flex flex-col gap-16">
          <div class="flex flex-col">
            <h4>
              {{ t('rpc.apiKey.headline') }}
            </h4>
            <p class="whitespace-pre-line">
              {{ t('rpc.initial.planSelection') }}
            </p>
            <ul class="mt-6">
              <li v-for="(benefit, keyB) in benefits" :key="keyB" class="my-2">
                <NuxtIcon
                  name="icon/success"
                  class="inline-block float-left mr-2 text-2xl text-green"
                />
                <span>
                  <strong v-if="benefit.bolded">{{ benefit.bolded }}</strong>
                  {{ benefit.text }}
                </span>
              </li>
            </ul>
          </div>
          <div class="flex flex-col gap-4">
            <div class="flex flex-row gap-4">
              <RpcSubscriptionPackage
                v-for="(rpcPackage, key) in subscriptionPackages"
                :key="key"
                :on-press="
                  () => {
                    handlePackagePress(rpcPackage.id);
                    handleContinuePress();
                  }
                "
                :package="rpcPackage"
                :is-selected="selectedPackage === rpcPackage.id"
                :loading="loading && selectedPackage === rpcPackage.id"
                :allow-switch="allowSwitch"
                :is-owner="dataStore.isUserOwner"
              />
            </div>
          </div>
        </div>
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { RpcPlanType } from '~/lib/types/rpc';

const { t, tm } = useI18n();
const subscriptionPackages = computed(() => [
  {
    id: 0,
    name: 'Free',
    price: 0,
    benefits: [
      '20 Requests/sec',
      '500,000 daily request limit',
      'Access 100+ Blockchains',
      'Trace APIs',
      'Debug APIs',
    ],
    limits: '5 million API requests included',
  },
  {
    id: 5,
    name: 'Developer',
    price: 49,
    benefits: [
      '20 Requests/sec',
      '500,000 daily request limit',
      'Access 100+ Blockchains',
      'Trace APIs',
      'Debug APIs',
      'Autoscaling',
      'Extended support',
    ],
    limits: '25 million API requests included',
  },
]);

const benefits = computed(() => {
  const rawBenefits = tm('rpc.initial.subscriptionBenefits') as Array<{
    text?: {
      body: {
        static: string;
      };
    };
    bolded?: {
      body: {
        static: string;
      };
    };
  }>;
  return rawBenefits.map(benefit => ({
    text: benefit.text?.body.static || '',
    bolded: benefit.bolded?.body.static || '',
  }));
});

const paymentStore = usePaymentStore();

const selectedPackage = ref<number>(0);
const initialPackage = ref<number>(0);
const allowSwitch = ref<boolean>(true);
const dataStore = useDataStore();

onMounted(async () => {
  const rpcPlan = await paymentStore.getRpcPlan();

  if (rpcPlan === RpcPlanType.PAID) {
    selectedPackage.value = 5;
    initialPackage.value = 5;
    allowSwitch.value = false;
  } else if (rpcPlan === RpcPlanType.FREE) {
    selectedPackage.value = 0;
    initialPackage.value = 0;
  } else {
    navigateTo('/dashboard/service/rpc');
  }
});

const handlePackagePress = (id: number) => {
  selectedPackage.value = id;
};

const handleContinuePress = () => {
  if (selectedPackage.value === initialPackage.value) {
    navigateTo('/dashboard/service/rpc');
  } else {
    getSubscriptionSessionUrl(selectedPackage.value);
  }
};

const { loading, getSubscriptionSessionUrl } = usePayment();
</script>
