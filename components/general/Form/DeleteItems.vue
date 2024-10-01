<template v-if="items.length">
  <Btn type="error" class="w-full mt-2" :loading="loading" @click="onDelete">
    <slot v-if="$slots.default"></slot>
    <template v-else>{{ $t('form.confirm') }}</template>
  </Btn>
</template>

<script lang="ts" setup>
import type { ItemDelete } from '~/composables/useDelete';

const emit = defineEmits(['submitSuccess']);
const props = defineProps({
  items: { type: Array<ItemDelete>, required: true },
});

const { loading, deleteItems } = useDelete();

async function onDelete() {
  if (await deleteItems(props.items)) {
    emit('submitSuccess');
  }
}
</script>
