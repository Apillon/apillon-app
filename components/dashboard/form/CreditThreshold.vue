<template>
  <n-form
    ref="formRef"
    class="max-w-lg"
    :model="formData"
    :rules="rules"
    :disabled="!dataStore.isUserOwner"
    @submit.prevent="handleSubmit"
  >
    <n-grid :cols="12" :x-gap="32">
      <!--  Threshold -->
      <n-form-item-gi
        :span="8"
        path="threshold"
        :label="$t('form.label.creditThreshold')"
        :label-props="{ for: 'threshold' }"
      >
        <n-input-number
          v-model:value="formData.threshold"
          :input-props="{ id: 'threshold' }"
          :placeholder="$t('form.placeholder.typeHere')"
          min="0"
          step="1"
          clearable
        />
      </n-form-item-gi>

      <!--  Submit -->
      <n-form-item-gi :span="4">
        <input type="submit" class="hidden" :value="$t('form.update')" />
        <Btn type="primary" class="w-full px-2" :loading="loading" @click="handleSubmit">
          {{ $t('form.update') }}
        </Btn>
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<script lang="ts" setup>
type FormCreditThreshold = {
  threshold: number;
};

const { t } = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const paymentStore = usePaymentStore();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);

const formData = ref<FormCreditThreshold>({
  threshold: paymentStore.credit.threshold || 0,
});

const rules: NFormRules = {
  threshold: [ruleNaturalNumber(t('validation.naturalNumber'))],
};

watch(
  () => paymentStore.credit.threshold,
  (threshold, prevValue) => {
    if (threshold && !prevValue) {
      formData.value.threshold = threshold;
    }
  }
);

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (!errors) {
      await updateThreshold();
    }
  });
}
async function updateThreshold() {
  loading.value = true;

  try {
    const res = await $api.patch<CreditResponse>(endpoints.creditSettings(dataStore.projectUuid), formData.value);

    paymentStore.credit = res.data;
    message.success(t('form.success.updated.creditThreshold'));
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
