<template>
  <div v-if="loading">
    <Spinner />
  </div>
  <!-- Referral - rewards -->
  <div v-else class="pb-8">
    <div v-for="(item, index) in merchData" :key="index" class="bg-grey-dark px-10 py-5 mb-4">
      <!-- Item Name -->

      <!-- Item points cost -->
      <div class="flex justify-between">
        <h4>{{ item.merchItem.name }}</h4>
        <div class="mt-2">
          {{ 'Cost: ' + item.merchItem.price + ' points' }}
        </div>
      </div>

      <!-- Item description -->
      <div class="font-button text-sm text-white mb-5 mt-8">
        {{ item.merchItem.description }}
      </div>
      <!-- Item img -->
      <img :src="item.merchItem.imageUrl" alt="apillon merch" />

      <div
        class="flex"
        :class="item.merchItem.attributes.length > 0 ? 'justify-between' : 'justify-center'"
      >
        <div v-for="(attr, idx) in item.merchItem.attributes" :key="attr.id" class="mr-4">
          {{ attr.name }}
          <n-select
            :id="attr.id"
            v-model:value="item.attributes[idx].selectedValue"
            class="mt-2 mb-1 w-[100px] bg-primary"
            :options="
              attr.options.map(el => {
                return { label: el, value: el };
              })
            "
            :disabled="Number(item.merchItem.price) > referralStore.balance_all"
          >
            <template #arrow>
              <span class="icon-down text-2xl"></span>
            </template>
          </n-select>
        </div>
        <Btn
          :disabled="Number(item.merchItem.price) > referralStore.balance_all"
          class="mt-7 flex-grow"
          type="primary"
          @click="claimReward(item)"
        >
          {{ $t('referral.claim') }}
        </Btn>
      </div>
    </div>
  </div>
  <modal v-model:show="showModal" :title="'Great choice!'">
    <ReferralClaimReward :data="claimRewardData" @close-modal="showModal = false" />
  </modal>
</template>

<script lang="ts" setup>
const referralStore = useReferralStore();
const showModal = ref(false);

const merchData = ref(
  [] as {
    merchItem: {
      attributes: {
        name: string;
        id: number;
        options: string[];
        description: string;
        inputType: number;
      }[];
      description: string;
      id: number;
      imageUrl: string;
      maxOrderCount: number;
      name: string;
      price: number;
      status: number;
      stock: number;
    };
    attributes: {
      name: string;
      selectedValue: string;
    }[];
  }[]
);

const loading = ref(false);

onMounted(async () => {
  await getMerch();
});

async function getMerch() {
  loading.value = true;
  try {
    const res = await $api.get<{
      data: {
        items: {
          attributes: [];
          description: string;
          id: number;
          imageUrl: string;
          maxOrderCount: number;
          name: string;
          price: number;
          status: number;
          stock: number;
        }[];
      };
    }>(endpoints.referralRewards);

    merchData.value = res.data.items.map(el => {
      return {
        merchItem: el,
        attributes: el.attributes.map(attr => {
          return {
            name: attr.name,
            selectedValue: attr.options[0],
          };
        }),
      };
    });
    console.log('merhcData: ', merchData.value[0]);
    console.log('My res products: ', res);
  } catch (e) {
    console.error(e);
  }
  loading.value = false;
}

const emit = defineEmits(['claimReward']);

const claimRewardData = ref({});

function claimReward(item) {
  console.log('Item: ', item.attributes);
  console.log('Item size: ', item.attributes.find(el => el.name === 'size').selectedValue);
  console.log('Data: ', merchData.value);

  claimRewardData.value = item;
  showModal.value = true;
  // emit('claimReward', item);
}
</script>
