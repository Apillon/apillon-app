<template>
  <div class="flex gap-8 pb-8">
    <div class="flex-1">
      <SimpletContent :content="content" />
      <CardServices
        :services="[ServiceType.STORAGE, ServiceType.HOSTING, ServiceType.NFT, ServiceType.EMBEDDED_WALLET]"
      />
    </div>

    <div class="flex h-fit w-full flex-col justify-center gap-6 md:max-w-60">
      <div class="card relative p-6">
        <PoweredBy class="font-semibold text-white-terciary" :icons="['logo/docker']" />
        <hr class="my-4 border-bg-lighter" />
        <div class="mt-5 flex justify-between gap-4">
          <small>{{ $t('dashboard.credits.pricing') }}</small>
          <div class="flex flex-col gap-1 text-right text-xs">
            <strong>150 credits for setup</strong>
            <span>Check pricing</span>
          </div>
        </div>
      </div>
      <div class="card relative p-6">
        <h6>{{ $t('simplet.deploy') }}</h6>
        <div class="mt-5 flex flex-col gap-4">
          <Btn class="w-full" type="info" href="https://github.com/Apillon/nft-studio-template">
            <span class="icon-github mr-2"></span>
            <strong> {{ $t('simplet.viewCode') }}</strong>
          </Btn>
          <Btn @click="showModalNewSimplet = true">
            {{ $t('auth.onboarding.getStarted') }}
          </Btn>
        </div>
      </div>
    </div>

    <!-- Modal - New Simplet -->
    <SimpletModal v-model:show="showModalNewSimplet" :type="simpletId" :title="$t('simplet.wizard.create')" />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  simpletId: { type: Number, default: SimpletType.AIRDROP },
});
const { simplets, generateContent } = useSimplet();

const showModalNewSimplet = ref<boolean>(false);
const content = generateContent(simplets[props.simpletId]);
</script>
