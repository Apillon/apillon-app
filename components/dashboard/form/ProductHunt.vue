<template>
  <n-form
    v-bind="$attrs"
    ref="formRef"
    :model="productHuntStore.form"
    :rules="rules"
    autocomplete="off"
    @submit.prevent="handleSubmit"
  >
    <n-form-item path="url" :label="$t('form.label.productHunt.url')" :label-props="{ for: 'url' }">
      <n-input
        v-model:value="productHuntStore.form.url"
        :input-props="{ id: 'url' }"
        :placeholder="$t('form.placeholder.productHunt.url')"
        clearable
      />
    </n-form-item>

    <n-form-item
      path="wallet"
      :label="$t('form.label.productHunt.wallet')"
      :label-props="{ for: 'wallet' }"
    >
      <n-input
        v-model:value="props.wallet"
        :input-props="{ id: 'wallet' }"
        :disabled="true"
      ></n-input>
    </n-form-item>

    <n-form-item :show-feedback="false" :show-label="false">
      <input type="submit" class="hidden" :value="$t('form.continue')" />

      <Btn type="primary" class="w-full mt-2" :loading="loading" @click="handleSubmit">
        {{ $t('form.continue') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>
<script lang="ts" setup>
const props = defineProps({
  id: { type: Number, default: 0 },
  wallet: { type: String, default: '' },
});

const $i18n = useI18n();
const message = useMessage();

const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess', 'close']);

const productHuntStore = useProductHuntStore();
const formRef = ref<NFormInst | null>(null);
const loading = ref<boolean>(false);

const rules: NFormRules = {
  url: [ruleRequired($i18n.t('validation.productHunt.urlRequired'))],
};

function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      createProductHuntComment();
    }
  });
}

async function createProductHuntComment() {
  loading.value = true;

  try {
    const bodyData = productHuntStore.form;

    const res = await $api.post<ProductHuntCommentResponse>(endpoints.productHuntComment, bodyData);

    message.success(
      $i18n.t(props.id ? 'form.success.updated.productHunt' : 'form.success.created.productHunt')
    );

    productHuntStore.comment = res.data;

    emit('submitSuccess', res.data);
    emit('createSuccess', res.data);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
