<template>
  <div class="card-border p-4 flex flex-col gap-2 rounded-lg">
    <h4>{{ $t('general.actions') }}</h4>

    <div v-if="!assetHubStore.account">
      <Btn type="primary" :loading="loadingWallet" @click="modalWalletSelectVisible = true">
        {{ $t('dashboard.service.assetHub.connectWallet') }}
      </Btn>
    </div>
    <template v-else>
      <Btn size="small" @click="modalSendTokensVisible = true">
        <strong>{{ $t('dashboard.service.assetHub.sendTokens') }}</strong>
      </Btn>
      <Btn size="small" :color="colors.blue" @click="modalMintTokensVisible = true">
        <strong>{{ $t('dashboard.service.assetHub.mintTokens') }}</strong>
      </Btn>
      <n-button size="small" @click="modalTransferVisible = true">
        {{ $t('dashboard.service.assetHub.transfer') }}
      </n-button>
      <n-button size="small" @click="modalChangeIssuerVisible = true">
        {{ $t('dashboard.service.assetHub.changeIssuer') }}
      </n-button>
      <n-button size="small" @click="modalChangeFreezerVisible = true">
        {{ $t('dashboard.service.assetHub.changeFreezer') }}
      </n-button>
      <n-button size="small" @click="modalEditAssetVisible = true">
        <span class="icon-edit text-xl mr-2"></span>
        {{ $t('dashboard.service.assetHub.edit') }}
      </n-button></template
    >
  </div>

  <!-- Modal - Wallet select -->
  <modal v-model:show="modalWalletSelectVisible" :title="$t('auth.wallet.connect.title')">
    <AuthWalletDot
      :action-text="$t('auth.wallet.connect.btn')"
      :loading="loadingWallet"
      @sign="walletConnect"
    />
  </modal>

  <Modal
    v-model:show="modalSendTokensVisible"
    class="text-center"
    :title="$t('dashboard.service.assetHub.sendTokens')"
  >
    <p class="relative -top-4 text-center px-4">
      {{ $t('dashboard.service.assetHub.sendTokensInfo') }}
    </p>
    <FormAssetHubSendTokens
      class="text-left"
      :assetId="assetId"
      @close="modalSendTokensVisible = false"
    />
  </Modal>

  <Modal
    v-model:show="modalMintTokensVisible"
    class="text-center"
    :title="$t('dashboard.service.assetHub.mintTokens')"
  >
    <p class="relative -top-4 text-center px-4">
      {{ $t('dashboard.service.assetHub.mintTokensInfo') }}
    </p>
    <FormAssetHubMintTokens
      class="text-left"
      :assetId="assetId"
      @close="modalMintTokensVisible = false"
    />
  </Modal>

  <Modal
    v-model:show="modalTransferVisible"
    class="text-center"
    :title="$t('dashboard.service.assetHub.transfer')"
  >
    <p class="relative -top-4 text-center px-4">
      {{ $t('dashboard.service.assetHub.transferInfo') }}
    </p>
    <FormAssetHubTransfer
      class="text-left"
      :assetId="assetId"
      @close="modalTransferVisible = false"
    />
  </Modal>

  <Modal
    v-model:show="modalChangeIssuerVisible"
    class="text-center"
    :title="$t('dashboard.service.assetHub.changeIssuer')"
  >
    <p class="relative -top-4 text-center px-4">
      {{ $t('dashboard.service.assetHub.changeIssuerInfo') }}
    </p>
    <FormAssetHubChangeIssuer
      class="text-left"
      :assetId="assetId"
      @close="modalChangeIssuerVisible = false"
    />
  </Modal>

  <Modal
    v-model:show="modalChangeFreezerVisible"
    class="text-center"
    :title="$t('dashboard.service.assetHub.changeFreezer')"
  >
    <p class="relative -top-4 text-center px-4">
      {{ $t('dashboard.service.assetHub.changeFreezerInfo') }}
    </p>
    <FormAssetHubChangeFreezer
      class="text-left"
      :assetId="assetId"
      @close="modalChangeFreezerVisible = false"
    />
  </Modal>

  <Modal
    v-model:show="modalEditAssetVisible"
    class="text-center"
    :title="$t('dashboard.service.assetHub.asset')"
  >
    <FormAssetHub class="text-left" @close="modalEditAssetVisible = false" />
  </Modal>
</template>

<script lang="ts" setup>
import colors from '~/tailwind.colors';

const { params } = useRoute();
const assetHubStore = useAssetHubStore();
const { loadingWallet, modalWalletSelectVisible, walletConnect } = useAssetHub();

const assetId = ref<number>(Number(params?.id));

const modalSendTokensVisible = ref<boolean>(false);
const modalMintTokensVisible = ref<boolean>(false);
const modalTransferVisible = ref<boolean>(false);
const modalChangeIssuerVisible = ref<boolean>(false);
const modalChangeFreezerVisible = ref<boolean>(false);
const modalEditAssetVisible = ref<boolean>(false);
</script>
