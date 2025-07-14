<!-- eslint-disable vue/no-mutating-props -->
<template>
  <n-grid class="items-end" :cols="12" :x-gap="16">
    <n-form-item-gi path="mysql.host" :span="9" :label="labelInfo('host')" :label-props="{ for: 'host' }">
      <n-input
        v-model:value="form.host"
        :input-props="{ id: 'host' }"
        :placeholder="$t('form.placeholder.mysql.host')"
        clearable
      />
    </n-form-item-gi>
    <n-form-item-gi path="mysql.port" :span="3" :label="$t('form.label.mysql.port')" :label-props="{ for: 'port' }">
      <n-input-number
        v-model:value="form.port"
        :min="0"
        :input-props="{ id: 'port' }"
        :placeholder="$t('form.placeholder.mysql.port')"
      />
    </n-form-item-gi>
  </n-grid>

  <n-form-item path="mysql.database" :label="$t('form.label.mysql.database')" :label-props="{ for: 'database' }">
    <n-input
      v-model:value="form.database"
      :input-props="{ id: 'database' }"
      :placeholder="$t('form.placeholder.mysql.database')"
      clearable
    />
  </n-form-item>

  <n-form-item path="mysql.user" :label="$t('form.label.mysql.user')" :label-props="{ for: 'user' }">
    <n-input
      v-model:value="form.user"
      :input-props="{ id: 'user' }"
      :placeholder="$t('form.placeholder.mysql.user')"
      clearable
    />
  </n-form-item>

  <n-form-item path="mysql.password" :label="$t('form.label.mysql.password')" :label-props="{ for: 'password' }">
    <n-input
      v-model:value="form.password"
      type="password"
      :input-props="{ id: 'password', autocomplete: 'off' }"
      :placeholder="$t('form.placeholder.mysql.password')"
      show-password-on="click"
      clearable
    />
  </n-form-item>
</template>

<script lang="ts" setup>
type FormMySql = {
  host: Optional<string>;
  port: Optional<number>;
  database: Optional<string>;
  user: Optional<string>;
  password: Optional<string>;
};
defineProps({
  form: { type: Object as PropType<FormMySql>, required: true },
});
const { labelInfo } = useForm('form.label.embeddedWallet');
</script>
