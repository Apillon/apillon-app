<template>
  <n-form
    ref="formRef"
    class="max-w-xl"
    :model="collectionStore.form.base"
    :rules="rules"
    @submit.prevent="handleSubmitForm"
  >
    <n-grid class="items-end" :cols="12" :x-gap="32">
      <!--  Collection name -->
      <n-form-item-gi
        :span="8"
        path="name"
        :label="infoLabel('collectionName') as string"
        :label-props="{ for: 'name' }"
      >
        <n-input
          v-model:value="collectionStore.form.base.name"
          :input-props="{ id: 'name' }"
          :placeholder="t('general.typeHere')"
          clearable
        />
      </n-form-item-gi>

      <!--  Collection Symbol -->
      <n-form-item-gi
        :span="4"
        path="symbol"
        :label="infoLabel('collectionSymbol') as string"
        :label-props="{ for: 'symbol' }"
      >
        <n-input
          v-model:value="collectionStore.form.base.symbol"
          :minlength="1"
          :maxlength="8"
          :input-props="{ id: 'symbol' }"
          :placeholder="t('general.typeHere')"
          clearable
        />
      </n-form-item-gi>

      <!--  Collection logo -->
      <n-form-item-gi
        :span="12"
        path="logo"
        :label="infoLabel('collectionLogo')"
        :label-props="{ for: 'collectionLogo' }"
      >
        <FormNftCollectionUpload :is-logo="true" />
      </n-form-item-gi>

      <!--  Collection cover image -->
      <n-form-item-gi
        :span="12"
        path="coverImage"
        :label="infoLabel('collectionCoverImage')"
        :label-props="{ for: 'coverImage' }"
      >
        <FormNftCollectionUpload />
      </n-form-item-gi>
    </n-grid>

    <!--  Form submit -->
    <n-form-item v-if="!hideSubmit" :show-label="false">
      <input type="submit" class="hidden" :value="t('form.proceed')" />
      <Btn type="primary" class="mt-2 w-full" @click="handleSubmitForm">
        {{ t('form.proceed') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
defineProps({
  hideSubmit: { type: Boolean, default: false },
});
const { t } = useI18n();
const message = useMessage();
const collectionStore = useCollectionStore();
const { formRef, rules, infoLabel } = useCollection();
defineExpose({ formRef, handleSubmitForm });

// Submit
function handleSubmitForm(e?: Event | MouseEvent): boolean {
  e?.preventDefault();
  formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else {
      collectionStore.step = CollectionStep.BEHAVIOR;
      return true;
    }
  });
  return false;
}
</script>
