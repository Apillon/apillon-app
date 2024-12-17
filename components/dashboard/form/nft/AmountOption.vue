<template>
  <div class="text-center">
    <h2>{{ t('nft.amount.title') }}</h2>
    <p>{{ t('nft.amount.content') }}</p>
    <div class="mt-4 grid grid-cols-2 justify-items-center gap-8 whitespace-pre-line">
      <div
        class="card-dark mt-3 flex max-w-[12rem] cursor-pointer flex-col justify-between p-4 sm:p-8"
        :class="{ '!border-yellow': collectionStore.amount === nftSingle.value }"
        @click="collectionStore.amount = nftSingle.value"
      >
        <div class="my-auto">
          <h6 class="min-h-[3rem]">{{ nftSingle.label }}</h6>
          <p>{{ nftSingle.subLabel }}</p>
        </div>
      </div>

      <div class="card-dark-multiple max-w-[12rem]" :class="{ active: collectionStore.amount === nftMultiple.value }">
        <div
          class="card-dark flex h-full cursor-pointer flex-col justify-between p-4 sm:p-8"
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
      {{ t('form.proceed') }}
    </Btn>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['submit']);
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
    emit('submit', collectionStore.amount);
  } else if (collectionStore.amount === NftAmount.MULTIPLE) {
    collectionStore.nftStep = NftCreateStep.MULTIPLE;
    collectionStore.stepUpload = NftUploadStep.FILE;
    emit('submit', collectionStore.amount);
  } else {
    message.warning(t('nft.validation.selectAmount'));
  }
}
</script>
