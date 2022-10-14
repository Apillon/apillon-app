<template>
  <n-form ref="formRef" :model="modelRef" :rules="rules">
    <n-form-item path="serviceName" :label="$t('form.label.serviceName')">
      <n-input
        v-model:value="modelRef.serviceName"
        :placeholder="$t('form.placeholder.serviceName')"
      />
    </n-form-item>
    <n-tag :bordered="false" type="info" class="mb-8">Servicename.com/ </n-tag>

    <n-form-item path="networkTypes" :label="$t('form.label.networkType')">
      <n-radio-group v-model:value="modelRef.networkType" name="radiogroup">
        <n-space>
          <n-radio
            v-for="(type, key) in networkTypes"
            :key="key"
            :value="type.value"
            :label="type.label"
          />
        </n-space>
      </n-radio-group>
    </n-form-item>

    <n-form-item>
      <Btn type="primary" class="w-full mt-2" @click="handleValidateClick">
        {{ $t('form.createServiceAndContinue') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import {
  NForm,
  NFormItem,
  NInput,
  NRadioGroup,
  NRadio,
  NSpace,
  NTag,
  FormInst,
  createDiscreteApi,
  FormValidationError,
} from 'naive-ui';
import { useI18n } from 'vue-i18n';
const $i18n = useI18n();

interface ModelType {
  serviceName: string | null;
  networkType: boolean;
}

const formRef = ref<FormInst | null>(null);
const { message } = createDiscreteApi(['message']);
const $emit = defineEmits(['submit']);

const modelRef = ref<ModelType>({
  serviceName: null,
  networkType: false,
});

const rules = {
  serviceName: [
    {
      required: true,
      message: 'Please enter service name',
      trigger: 'input',
    },
  ],
  networkType: [],
};

const networkTypes = [
  {
    value: false,
    label: $i18n.t('form.label.networkTypes.test'),
  },
  {
    value: true,
    label: $i18n.t('form.label.networkTypes.live'),
  },
];

// Submit
function handleValidateClick(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
    if (!errors) {
      message.success('Valid');
      $emit('submit', true);
    } else {
      message.error('Invalid');
    }
  });
}
</script>
