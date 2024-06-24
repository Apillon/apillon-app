<template>
  <!-- Referral (Airdrop) -->
  <div class="card-light flex flex-wrap gap-4 p-8">
    <div class="flex-1 min-w-[16rem]">
      <h4 class="">{{ $t('referral.banner.title') }}</h4>
      <p class="mt-4 mb-6 whitespace-break-spaces">
        {{ $t('referral.banner.description') }}
      </p>
      <Btn type="primary" :to="{ name: 'dashboard-airdrop' }" class="mr-2">
        {{ $t('referral.banner.btn') }}
      </Btn>
      <!-- <Btn
        type="primary"
        :color="colors.blue"
        href="https://blog.apillon.io/nctr-airdrop-task-period-is-over-here-is-how-to-claim-rewards-fbd721241f11"
      >
        {{ $t('referral.banner.learnMoreBtn') }}
      </Btn> -->
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
import colors from '~/tailwind.colors';
</script>
