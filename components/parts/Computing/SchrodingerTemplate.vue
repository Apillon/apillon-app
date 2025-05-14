<template>
  <div
    class="w-full"
    :class="{ 'flex flex-col justify-between': showFooter }"
    :style="showFooter ? 'min-height: calc(100dvh - 280px)' : ''"
  >
    <div :class="{ 'flex items-center justify-center': showFooter }">
      <div class="mx-auto w-full max-w-lg text-center">
        <NuxtIcon name="nft/collection" class="icon-auto mb-4 flex justify-center" filled />
        <h2>{{ $t('computing.contract.created.title') }}</h2>
        <p class="mb-2 whitespace-pre-line text-body">
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
</script>
