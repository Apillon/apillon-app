<template>
  <select-options
    v-bind="$attrs"
    v-model:value="selectedRole"
    :options="userRoles"
    :placeholder="$t('form.placeholder.role')"
    :theme-overrides="SelectRoleOverrides"
    size="large"
    filterable
  />
</template>

<script lang="ts" setup>
import type { SelectOption, SelectProps } from 'naive-ui';

const attrs = useAttrs();
const emit = defineEmits(['roleChange']);

/** Theme override */
type SelectThemeOverrides = NonNullable<SelectProps['themeOverrides']>;
const SelectRoleOverrides: SelectThemeOverrides = {
  peers: {
    InternalSelection: {
      color: 'transparent',
      border: '0px',
      borderActive: '0px',
      borderFocus: '0px',
      borderHover: '0px',
      boxShadowActive: 'none',
      boxShadowFocus: 'none',
      boxShadowHover: 'none',
      colorActive: 'inherit',
      colorDisabled: 'inherit',
      paddingMultiple: '0 26px 0 0px',
      paddingSingle: '0 26px 0 0px',
    },
  },
};

const selectedRole = computed({
  get() {
    return attrs.model;
  },
  set(newValue): void {
    emit('roleChange', newValue);
  },
});

const userRoles: Array<SelectOption> = CreateUserRoles();
</script>
