<template>
  <!-- Referral (Airdrop) -->
  <div class="card-light flex flex-wrap gap-4 p-8">
    <div class="flex-1 min-w-[16rem]">
      <h4>{{ $t('referral.banner.title') }}</h4>
      <p class="text-body my-4">
        {{ $t('referral.banner.description') }}
      </p>
      <Btn type="primary" :to="{ name: 'dashboard-airdrop' }">
        {{ $t('referral.banner.btn') }}
      </Btn>
    </div>
    <div class="flex-1 min-w-[16rem]">
      <Image
        :src="AirdropSVG"
        class="mx-auto my-5"
        :width="465"
        :height="143"
        alt="apillon airdrop"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import AirdropSVG from '~/assets/images/dashboard/airdrop.svg';
</script>
