<template>
  <Modal v-model:show="modalVisible" class="hide-header text-center">
    <IconSuccess class="text-2xl" />

    <h2 v-if="title" class="mb-2 mt-6">{{ title }}</h2>
    <h2 v-else class="mb-2 mt-6">{{ $t('form.success.created.item') }}</h2>

    <p v-if="content">{{ content }}</p>
    <slot />

    <Btn v-if="btn1" type="primary" class="mt-8 w-full" @click="btn1Action">
      {{ btn1 }}
    </Btn>
    <Btn v-if="btn2" type="secondary" class="mt-2 w-full" @click="btn2Action">
      {{ btn2 }}
    </Btn>
  </Modal>
</template>

<script lang="ts" setup>
defineProps({
  title: { type: String, default: '' },
  content: { type: String, default: '' },
  btn1: { type: String, default: '' },
  btn1Action: { type: Function as PropType<() => void>, default: () => {} },
  btn2: { type: String, default: '' },
  btn2Action: { type: Function as PropType<() => void>, default: () => {} },
});

const modalVisible = ref<boolean>(true);
</script>
