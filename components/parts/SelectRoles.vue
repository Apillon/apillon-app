<template>
  <select-options
    v-bind="$attrs"
    v-model:value="selectedRoles"
    :placeholder="$t('form.placeholder.role')"
    :theme-overrides="SelectRoleOverrides"
    size="large"
    multiple
    filterable
  />
</template>

<script lang="ts" setup>
import { SelectProps } from 'naive-ui';

type SelectThemeOverrides = NonNullable<SelectProps['themeOverrides']>;
const SelectRoleOverrides: SelectThemeOverrides = {
  peers: {
    InternalSelection: {
      border: `0px`,
      paddingMultiple: '0 26px 0 0px',
      paddingSingle: '0 26px 0 0px',
    },
  },
};

const attrs = useAttrs();
const emit = defineEmits(['roleChange']);

const selectedRoles = computed({
  get() {
    return attrs.model;
  },
  set(newValue): void {
    console.log(newValue);
    emit('roleChange', newValue);
  },
});
</script>
