<script lang="ts">
import { nanoid } from 'nanoid';

export default defineComponent({
  inheritAttrs: false,
});
</script>

<script lang="ts" setup>
defineProps({
  modelValue: { type: [String, Number], default: null },
  id: { type: String, default: '' },
  type: { type: String, default: 'text' },
  label: { type: String, default: '' },
  error: { type: [String, Boolean], default: '' },

  wrapperClass: { type: [String, Array, Object], default: '' },
  labelClass: { type: [String, Array, Object], default: '' },
});

const uid = 'k-' + nanoid(6);
</script>

<template>
  <div :class="wrapperClass">
    <label
      v-if="label"
      :for="id || uid"
      class="block font-sans font-light text-xs mb-2"
      :class="labelClass"
    >
      {{ label }}
    </label>

    <input
      v-bind="$attrs"
      :id="id || uid"
      :modelValue="modelValue"
      :type="type"
      :class="[$style.input, { '!border-red !text-red': error }]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <transition name="scaleY">
      <FormError :text="error" class="mt-1 mx-0 mb-0" />
    </transition>
  </div>
</template>

<style lang="postcss" module>
.input {
  @apply bg-transparent text-sm
    border border-white border-opacity-50 border-solid rounded-lg
    py-3.5 pl-5 pr-4;

  transition: border-color 0.2s;

  &:hover {
    @apply border-gold-dark;
  }

  &:focus,
  &:active {
    @apply border-gold outline-none;
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    transition: background-color 0s 2500000s, color 0s 2500000s, border-color 0.2s;
  }
}
</style>
