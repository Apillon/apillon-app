<template>
  <!-- Referral - sharing -->
  <!-- Referral - rewards -->
  <div>
    <div v-for="(item, index) in merch" :key="index" class="bg-grey-dark px-10 py-5">
      <!-- Item Name -->
      <h4>{{ item.title }}</h4>

      <!-- Item info -->
      <div class="font-button text-sm text-white mb-5 mt-8">
        {{ $t('referral.rewards.shirt.info') }}
        <div>
          {{ $t('referral.rewards.shirt.info1') }}
        </div>
        <div>
          {{ $t('referral.rewards.shirt.info2') }}
        </div>
        <div>
          {{ $t('referral.rewards.shirt.info3') }}
        </div>
      </div>
      <!-- Item img -->
      <img :src="item.image" alt="apillon merch" />

      <Btn type="primary" @click="claimReward(img)">{{ $t('referral.claim') }}</Btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
const merch = [
  {
    title: 'Apillon T-shirt',
    image: '/images/referral/merch_3.jpg',
    price: 15,
  },
  {
    title: 'Apillon socks',
    image: '/images/referral/merch_2.jpg',
    price: 15,
  },
];

const emit = defineEmits(['claimReward']);

function claimReward(img) {
  emit('claimReward', img);
}
</script>
