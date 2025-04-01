<template>
  <div class="card-border flex flex-col gap-2 rounded-lg p-4">
    <h4>{{ $t('general.actions') }}</h4>

    <div v-if="!assetHubStore.account">
      <Btn type="primary" :loading="loadingWallet" @click="modalWalletSelectVisible = true">
        {{ $t('assetHub.connectWallet') }}
      </Btn>
    </div>
    <template v-else>
      <Btn size="small" @click="modalSendTokensVisible = true">
        <strong>{{ $t('assetHub.sendTokens') }}</strong>
      </Btn>
      <Btn size="small" :color="colors.blue" @click="modalMintTokensVisible = true">
        <strong>{{ $t('assetHub.mintTokens') }}</strong>
      </Btn>
      <n-button size="small" @click="modalTransferVisible = true">
        {{ $t('assetHub.transfer') }}
      </n-button>
      <n-button size="small" @click="modalChangeIssuerVisible = true">
        {{ $t('assetHub.changeIssuer') }}
      </n-button>
      <n-button size="small" @click="modalChangeFreezerVisible = true">
        {{ $t('assetHub.changeFreezer') }}
      </n-button>
      <n-button size="small" @click="modalEditAssetVisible = true">
        <span class="icon-edit mr-2 text-xl"></span>
        {{ $t('assetHub.edit') }}
      </n-button></template
    >
  </div>

  <!-- Modal - Wallet select -->
  <modal v-model:show="modalWalletSelectVisible" :title="$t('auth.wallet.connect.title')">
    <AuthWalletDot :action-text="$t('auth.wallet.connect.btn')" :loading="loadingWallet" @sign="walletConnect" />
  </modal>

  <Modal v-model:show="modalSendTokensVisible" class="text-center" :title="$t('assetHub.sendTokens')">
    <p class="relative -top-4 px-4 text-center">
      {{ $t('assetHub.sendTokensInfo') }}
    </p>
    <FormAssetHubSendTokens
      class="text-left"
      :asset-id="assetId"
      @submit-success="refreshAsset(assetId)"
      @close="modalSendTokensVisible = false"
    />
  </Modal>

  <Modal v-model:show="modalMintTokensVisible" class="text-center" :title="$t('assetHub.mintTokens')">
    <!-- <p class="relative -top-4 text-center px-4">
      {{ $t('assetHub.mintTokensInfo') }}
    </p> -->
    <FormAssetHubMintTokens
      class="text-left"
      :asset-id="assetId"
      @submit-success="refreshAsset(assetId)"
      @close="modalMintTokensVisible = false"
    />
  </Modal>

  <Modal v-model:show="modalTransferVisible" class="text-center" :title="$t('assetHub.transfer')">
    <p class="relative -top-4 px-4 text-center">
      {{ $t('assetHub.transferInfo') }}
    </p>
    <FormAssetHubTransfer
      class="text-left"
      :asset-id="assetId"
      @submit-success="onTransferred"
      @close="modalTransferVisible = false"
    />
  </Modal>

  <Modal v-model:show="modalChangeIssuerVisible" class="text-center" :title="$t('assetHub.changeIssuer')">
    <p class="relative -top-4 px-4 text-center">
      {{ $t('assetHub.changeIssuerInfo') }}
    </p>
    <FormAssetHubChangeIssuer class="text-left" :asset-id="assetId" @close="modalChangeIssuerVisible = false" />
  </Modal>

  <Modal v-model:show="modalChangeFreezerVisible" class="text-center" :title="$t('assetHub.changeFreezer')">
    <p class="relative -top-4 px-4 text-center">
      {{ $t('assetHub.changeFreezerInfo') }}
    </p>
    <FormAssetHubChangeFreezer class="text-left" :asset-id="assetId" @close="modalChangeFreezerVisible = false" />
  </Modal>

  <Modal v-model:show="modalEditAssetVisible" class="text-center" :title="$t('assetHub.edit')">
    <FormAssetHub
      class="text-left"
      :asset-id="assetId"
      @submit-success="refreshAsset(assetId)"
      @close="modalEditAssetVisible = false"
    />
  </Modal>
</template>

<script lang="ts" setup>
import { colors } from '~/tailwind.config';

const { params } = useRoute();
const router = useRouter();
const assetHubStore = useAssetHubStore();
const { loadingWallet, modalWalletSelectVisible, refreshAsset, walletConnect } = useAssetHub();

const assetId = ref<number>(Number(params?.id));

const modalSendTokensVisible = ref<boolean>(false);
const modalMintTokensVisible = ref<boolean>(false);
const modalTransferVisible = ref<boolean>(false);
const modalChangeIssuerVisible = ref<boolean>(false);
const modalChangeFreezerVisible = ref<boolean>(false);
const modalEditAssetVisible = ref<boolean>(false);

async function onTransferred() {
  await refreshAsset(assetId.value);

  router.push({ name: 'dashboard-service-asset-hub' });
}
</script>
