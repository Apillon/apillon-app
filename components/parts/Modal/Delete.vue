<template>
  <n-modal v-bind="$attrs" ref="modalRef" :mask-closable="false">
    <n-card
      class="!max-w-xl"
      :title="title || $t(`general.archive`)"
      :bordered="false"
      role="dialog"
      aria-modal="true"
      size="large"
    >
      <template #header-extra>
        <button type="button" class="n-base-close n-card__close" @click="closeModal">
          <span class="icon-close align-sub text-xl"></span>
        </button>
      </template>

      <div v-if="$slots.content" class="pb-8">
        <slot name="content"> </slot>
      </div>

      <n-grid :cols="2" :x-gap="32" class="items-end">
        <n-gi>
          <n-button class="w-full" type="primary" @click="closeModal">
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
