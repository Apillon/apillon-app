<template>
  <n-modal v-bind="$attrs" ref="modalRef" :mask-closable="false">
    <n-card
      class="!max-w-xl"
      :title="title || $t('dashboard.payment.spendingAlert')"
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
        <div class="flex gap-6">
          <div class="w-1/2">
            <Btn type="info" size="large" @click="$emit('close')">
              <template v-if="btnCloseText">
                {{ btnCloseText }}
              </template>
              <template v-else>
                {{ $t('dashboard.payment.decline') }}
              </template>
            </Btn>
          </div>
          <div class="w-1/2">
            <Btn type="primary" size="large" @click="confirm">
              <template v-if="btnConfirmText">
                {{ btnConfirmText }}
              </template>
              <template v-else>
                {{ $t('dashboard.payment.buy') }}
              </template>
            </Btn>
          </div>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import { NModal } from 'naive-ui';

defineProps({
  title: { type: String, default: null },
  content: { type: String, default: '' },
  btnCloseText: { type: String, default: null },
  btnConfirmText: { type: String, default: null },
});
const emit = defineEmits(['submit', 'close']);

/** Modal W3 Warn - close modal on button click */
const modalRef = ref<typeof NModal>();

function confirm() {
  if (modalRef.value) {
    modalRef.value.doUpdateShow(false);
    emit('submit');
  }
}
</script>
