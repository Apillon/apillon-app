<template>
  <div>
    <div class="card-light flex flex-wrap gap-4 p-8">
      <div class="flex-1 min-w-[16rem]">
        <h4 class="">{{ $t('producthunt.banner.title') }}</h4>

        <p class="mt-4 mb-6 whitespace-break-spaces">
          <span v-html="$t('producthunt.banner.subtitle')"></span>
        </p>
        <p class="mt-4 mb-6 whitespace-break-spaces">
          <span v-html="$t('producthunt.banner.description')"></span>
        </p>
        <Btn type="primary" class="mr-2" @click="onBannerBtnPress">
          {{ $t('producthunt.banner.btn') }}
        </Btn>
      </div>
      <div class="flex-1 min-w-[16rem]">
        <img
          src="/assets/images/dashboard/producthunt.png"
          class="mx-auto my-5"
          alt="apillon airdrop"
          width="200"
          height="200"
        />
      </div>
    </div>
    <hr class="border-bg-lighter my-8" />
  </div>
  <!-- Modal - Subscription -->
  <modal v-model:show="modalVisible" class="max-w-3xl" :title="$t('producthunt.modal.headline')">
    <FormProductHunt
      :id="productHuntStore.comment?.id"
      @submit-success="modalVisible = false"
      :wallet="props.wallet"
    />
  </modal>
</template>
<script lang="ts" setup>
const modalVisible = ref<boolean>(false);
const productHuntStore = useProductHuntStore();

const props = defineProps({
  wallet: { type: String, default: '' },
});

onMounted(async () => {
  await productHuntStore.getComment();
});

const onBannerBtnPress = () => {
  if (productHuntStore.comment) {
    productHuntStore.form.url = productHuntStore.comment.url;
  }
  modalVisible.value = true;
};
</script>
