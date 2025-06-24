<template>
  <Btn v-if="id" type="error" class="mt-2 w-full" :loading="loading" @click="onDelete">
    <slot v-if="$slots.default"></slot>
    <template v-else>{{ $t('form.confirm') }}</template>
  </Btn>
</template>

<script lang="ts" setup>
const emit = defineEmits(['submitSuccess']);
const props = defineProps({
  id: { type: [String, Number], default: null },
  type: { type: String as PropType<ItemDeleteType>, required: true },
});

const { loading, deleteItem } = useDelete();

async function onDelete() {
  if (await deleteItem(props.type, props.id)) {
    emit('submitSuccess', props.id);
  }
}
</script>
