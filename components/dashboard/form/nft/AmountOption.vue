<template>
  <div class="text-center">
    <h2>{{ $t('nft.amount.title') }}</h2>
    <p>{{ $t('nft.amount.content') }}</p>
    <div class="grid grid-cols-2 gap-8 whitespace-pre-line mt-4 justify-center">
      <div
        class="card-dark flex flex-col justify-between p-4 sm:p-8 mt-3 cursor-pointer max-w-[12rem]"
        :class="{ '!border-yellow': collectionStore.amount === nftSingle.value }"
        @click="collectionStore.amount = nftSingle.value"
      >
        <div class="my-auto">
          <h6 class="min-h-[3rem]">{{ nftSingle.label }}</h6>
          <p>{{ nftSingle.subLabel }}</p>
        </div>
      </div>

      <div
        class="card-dark-multiple max-w-[12rem]"
        :class="{ active: collectionStore.amount === nftMultiple.value }"
      >
        <div
          class="card-dark flex flex-col justify-between p-4 sm:p-8 h-full cursor-pointer"
          :class="{ '!border-yellow': collectionStore.amount === nftMultiple.value }"
          @click="collectionStore.amount = nftMultiple.value"
        >
          <div class="my-auto">
            <h6 class="min-h-[3rem]">{{ nftMultiple.label }}</h6>
            <p>{{ nftMultiple.subLabel }}</p>
          </div>
        </div>
      </div>
    </div>

    <Btn class="mt-8" size="large" :disabled="!collectionStore.amount" @click="handleSubmit()">
      {{ $t('form.proceed') }}
    </Btn>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const message = useMessage();
const collectionStore = useCollectionStore();

const nftSingle = {
  label: t('nft.amount.single'),
  subLabel: t('nft.amount.singleContent'),
  value: NftAmount.SINGLE,
};

const nftMultiple = {
  label: t('nft.amount.multiple'),
  subLabel: t('nft.amount.multipleContent'),
  value: NftAmount.MULTIPLE,
};

function handleSubmit() {
  if (collectionStore.amount === NftAmount.SINGLE) {
    collectionStore.nftStep = NftCreateStep.SINGLE;
  } else if (collectionStore.amount === NftAmount.MULTIPLE) {
    collectionStore.nftStep = NftCreateStep.MULTIPLE;
    collectionStore.stepUpload = NftUploadStep.FILE;
  } else {
    message.warning(t('nft.validation.selectAmount'));
  }
}
</script>
