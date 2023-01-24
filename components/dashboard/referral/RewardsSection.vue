<template>
  <div v-if="loading">
    <Spinner />
  </div>
  <!-- Referral - rewards -->
  <div v-else class="pb-8">
    <div v-for="(item, index) in merchData" :key="index" class="bg-bg-light p-8 mb-4 w-full">
      <!-- Item Name -->

      <!-- Item points cost -->
      <div class="flex justify-between">
        <h3>{{ item.merchItem.name }}</h3>
        <n-tag type="info" size="large" round>
          <strong>{{ 'Cost: ' + item.merchItem.price + ' points' }}</strong>
        </n-tag>
      </div>

      <!-- Item description -->
      <div class="font-button text-sm mb-10 mt-8 text-body">
        {{ item.merchItem.description }}
      </div>
      <!-- Item img -->
      <img class="w-[50%] mx-auto" :src="item.merchItem.imageUrl" alt="apillon merch" />

      <div
        class="flex"
        :class="item.merchItem.attributes.length > 0 ? 'justify-between' : 'justify-center'"
      >
        <div v-for="(attr, idx) in item.merchItem.attributes" :key="attr.id" class="mr-4">
          {{ attr.name === 'size' ? 'Size' : '' }}
          <n-select
            :id="attr.id"
            v-model:value="item.attributes[idx].selectedValue"
            class="mt-2 mb-1 w-[100px] bg-primary"
            :options="
              attr.options.map(el => {
                return { label: el, value: el };
              })
            "
            :disabled="
              Number(item.merchItem.price) > referralStore.balance ||
              item.merchItem.orderCount >= item.merchItem.maxOrderCount
            "
          >
            <template #arrow>
              <span class="icon-down text-2xl"></span>
            </template>
          </n-select>
        </div>
        <Btn
          :disabled="
            Number(item.merchItem.price) > referralStore.balance ||
            item.merchItem.orderCount >= item.merchItem.maxOrderCount
          "
          class="mt-7 flex-grow"
          type="primary"
          @click="claimReward(item)"
        >
          {{ $t('referral.claim') }}
        </Btn>
      </div>
      <div v-if="item.merchItem.orderCount >= item.merchItem.maxOrderCount" class="mt-4">
        <Notification type="warning" class="w-full mb-4 !bg-bg">
          {{ $t('project.quotaReached') }}
        </Notification>
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
      orderCount: number;
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
    const res = await $api.get<ReferralRewardsResponse>(endpoints.referralRewards);

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
  } catch (e) {
    console.error(e);
  }
  loading.value = false;
}

const claimRewardData = ref({});

function claimReward(item) {
  claimRewardData.value = item;
  showModal.value = true;
}
</script>
