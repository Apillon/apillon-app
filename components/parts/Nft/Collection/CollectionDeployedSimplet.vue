<template>
  <div class="text-center">
    <div class="mx-auto mb-16 mt-8 max-w-md">
      <IconSuccess class="text-3xl" />
      <h4 class="mt-6">{{ $t('simplet.wizard.collection.created') }}</h4>
      <p>{{ $t('simplet.wizard.collection.createdInfo') }}</p>
    </div>

    <div class="mt-8 text-center text-sm text-white-primary">
      <Btn @click="$emit('continue')">
        {{ $t('simplet.wizard.collection.createdContinue') }}
      </Btn>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['continue']);
</script>
