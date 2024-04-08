<template>
  <div
    class="w-full"
    :class="{ 'flex flex-col justify-between': showFooter }"
    :style="showFooter ? 'min-height: calc(100dvh - 280px)' : ''"
  >
    <div :class="{ 'flex justify-center items-center': showFooter }">
      <div class="w-full max-w-lg text-center mx-auto">
        <NuxtIcon name="nft/collection" class="flex justify-center icon-auto mb-4" filled />
        <h2>{{ $t('computing.contract.created.title') }}</h2>
        <p class="mb-2 text-body whitespace-pre-line">
          {{ $t('computing.contract.created.info') }}
        </p>

        <div class="mb-2 flex items-center justify-center text-body">
          <p>{{ $t('computing.contract.created.display') }}&nbsp;</p>

          <a href="https://github.com/Apillon/apillon-phala-demo/" target="_blank">
            <Btn type="builders" size="tiny">
              {{ $t('computing.contract.created.template') }}
            </Btn>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({ showFooter: { type: Boolean, default: false } });

const collectionStore = useCollectionStore();
</script>
