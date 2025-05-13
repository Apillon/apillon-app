<template>
  <div class="mb-8 flex flex-wrap justify-between xl:flex-nowrap">
    <div class="flex flex-col">
      <!-- DEMO -->
      <LearnVideo
        title="Embedded Wallet"
        html-content="https://www.youtube.com/embed/9y-9nz0tpVs"
        class="w-full max-w-lg"
      />
      <SimpletContent :content="content" />

      <h4 class="my-4">{{ $t('embeddedWallet.generate.title') }}</h4>
      <div class="mb-4 flex gap-4">
        <!-- Generate API key -->
        <Btn
          inner-class="flex items-center justify-center "
          type="primary"
          @click="modalNewEmbeddedWalletVisible = true"
        >
          <span>{{ $t('embeddedWallet.createNew') }}</span>
        </Btn>

        <BtnDocumentation href="https://wiki.apillon.io/build/12-embedded-wallets-integration.html" />
      </div>
    </div>

    <div class="mx-auto">
      <h4 class="mb-4 text-center">{{ $t('embeddedWallet.howItWorks') }}</h4>
      <Carousel class="w-full max-w-[440px]" :slides="[img1, img2, img3, img4, img5, img6]" />
    </div>

    <!-- Modal - Create new folder -->
    <modal v-model:show="modalNewEmbeddedWalletVisible" :title="$t('embeddedWallet.createNew')">
      <FormEmbeddedWallet @submit-success="modalNewEmbeddedWalletVisible = false" />
    </modal>
  </div>
</template>

<script lang="ts" setup>
import img1 from '/assets/images/embedded-wallet/1.png';
import img2 from '/assets/images/embedded-wallet/2.png';
import img3 from '/assets/images/embedded-wallet/3.png';
import img4 from '/assets/images/embedded-wallet/4.png';
import img5 from '/assets/images/embedded-wallet/5.png';
import img6 from '/assets/images/embedded-wallet/6.png';

const { generateContent } = useSimplet();
const content = generateContent('instructions', 'embeddedWallet');

const modalNewEmbeddedWalletVisible = ref<boolean>(false);
</script>
