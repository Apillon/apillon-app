<template>
  <n-modal v-bind="$attrs" ref="modalRef" :mask-closable="false">
    <n-card
      class="w3-warn !max-w-xl"
      :title="title || $t(`dashboard.w3Warn`)"
      :bordered="false"
      role="dialog"
      aria-modal="true"
      size="large"
    >
      <template v-if="content">
        <p>{{ content }}</p>
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
          <Btn type="info" size="large" @click="confirm">
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
const emit = defineEmits(['submit']);

/** Modal W3 Warn - close modal on button click */
const modalRef = ref<typeof NModal>();

function confirm() {
  if (modalRef.value) {
    modalRef.value.doUpdateShow(false);
    emit('submit');
  }
}
</script>
