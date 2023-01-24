<template>
  <n-modal v-bind="$attrs" ref="modalRef" class="!pb-4" :mask-closable="false">
    <n-card
      :title="title || $t(`dashboard.delete`)"
      :bordered="false"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <button type="button" tabindex="0" aria-label="close" class="n-base-close n-card__close">
          <span class="icon-close align-sub text-xl"></span>
        </button>
      </template>
      <slot name="content"> </slot>

      <n-grid :cols="2" :x-gap="32" class="items-center">
        <n-gi>
          <n-button class="w-full" type="error" ghost @click="closeModal">
            {{ $t('general.cancel') }}
          </n-button>
        </n-gi>

        <n-gi>
          <slot />
        </n-gi>
      </n-grid>
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import { NModal } from 'naive-ui';
defineProps({
  title: { type: String, default: null },
});

/** Modal W3 Warn - close modal on button click */
const modalRef = ref();

function closeModal() {
  if (modalRef.value) {
    modalRef.value.doUpdateShow(false);
  }
}
</script>
