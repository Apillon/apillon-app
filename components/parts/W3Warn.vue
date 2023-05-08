<template>
  <n-modal v-bind="$attrs" ref="modalRef" :mask-closable="false">
    <n-card
      class="w3-warn !max-w-xl"
      :title="title || $t(`dashboard.w3Warn`)"
      :bordered="false"
      role="dialog"
      aria-modal="true"
    >
      <template v-if="content">
        <p class="text-body">{{ content }}</p>
      </template>
      <template v-else>
        <div class="text-body">
          <slot />
        </div>
      </template>

      <template #footer>
        <template v-if="$slots.footer">
          <slot name="footer" />
        </template>
        <template v-else>
          <!-- Create new project -->
          <Btn type="info" size="large" @click="closeModal">
            <template v-if="btnText">
              {{ btnText }}
            </template>
            <template v-else>
              {{ $t('dashboard.gotIt') }}
            </template>
          </Btn>
        </template>
      </template>
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import { NModal } from 'naive-ui';

defineProps({
  title: { type: String, default: null },
  content: { type: String, default: '' },
  btnText: { type: String, default: null },
});

/** Modal W3 Warn - close modal on button click */
const modalRef = ref<typeof NModal>();

function closeModal() {
  if (modalRef.value) {
    modalRef.value.doUpdateShow(false);
  }
}
</script>
