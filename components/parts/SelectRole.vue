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
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();
const attrs = useAttrs();
const emit = defineEmits(['roleChange']);

/** Theme override */
type SelectThemeOverrides = NonNullable<NSelectProps['themeOverrides']>;
const SelectRoleOverrides: SelectThemeOverrides = {
  peers: {
    InternalSelection: {
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

const userRoles: Array<NSelectOption> = Object.entries(DefaultUserRoles).map(([roleId, role]) => {
  return {
    label: $i18n.t(`userRole.${role}`),
    value: parseInt(roleId),
  };
});
</script>
