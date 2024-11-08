<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col">
      <p class="whitespace-pre-line">
        {{ t('rpc.initial.planSelection') }}
      </p>
      <ul class="mt-4 ml-4 list-disc">
        <li v-for="(benefit, keyB) in benefits" :key="keyB" class="my-2">
          <strong v-if="benefit.bolded">{{ benefit.bolded }}</strong>
          {{ benefit.text }}
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
</template>

<script lang="ts" setup>
import { RpcPlanType } from '~/lib/types/rpc';

const emit = defineEmits(['close']);
const { t, tm, rt } = useI18n();
const dataStore = useDataStore();
const paymentStore = usePaymentStore();
const { loading, getSubscriptionSessionUrl } = usePayment();

const selectedPackage = ref<number>(0);
const initialPackage = ref<number>(0);
const allowSwitch = ref<boolean>(true);

onMounted(async () => {
  const rpcPlan = await paymentStore.getRpcPlan();

  if (rpcPlan === RpcPlanType.PAID) {
    selectedPackage.value = 5;
    initialPackage.value = 5;
    allowSwitch.value = false;
  } else if (rpcPlan === RpcPlanType.FREE) {
    selectedPackage.value = 0;
    initialPackage.value = 0;
  }
});

const subscriptionPackages = [
  {
    id: 0,
    name: 'Free plan',
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
];

const generateBenefits = () => {
  const rawBenefits =
    (tm('rpc.initial.subscriptionBenefits') as {
      text?: string;
      bolded?: string;
    }[]) || [];
  return rawBenefits.map(benefit => ({
    text: benefit.text ? rt(benefit.text) : undefined,
    bolded: benefit.bolded ? rt(benefit.bolded) : undefined,
  }));
};
const benefits = ref(generateBenefits());

const handlePackagePress = (id: number) => {
  selectedPackage.value = id;
};

const handleContinuePress = () => {
  if (selectedPackage.value === initialPackage.value) {
    emit('close');
  } else {
    getSubscriptionSessionUrl(selectedPackage.value);
  }
};
</script>
