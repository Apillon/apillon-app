<template>
  <component :is="btnType === 'naive' ? NButton : btnType === 'btn' ? Btn : 'button'" v-bind="$attrs" @click="onClick">
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { NButton } from 'naive-ui';

const emit = defineEmits(['click']);
const props = defineProps({
  serviceName: { type: String as PropType<PriceServiceName>, required: true },
  btnType: { type: String as PropType<'naive' | 'btn' | 'button'>, default: 'naive' },
});

const Btn = resolveComponent('Btn');
const warningStore = useWarningStore();

function onClick(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();

  warningStore.showSpendingWarning(props.serviceName, () => emit('click', event));
}
</script>
