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
        :label="infoLabel('collectionName')"
        :label-props="{ for: 'name' }"
      >
        <n-input
          v-model:value="collectionStore.form.base.name"
          :input-props="{ id: 'name' }"
          :placeholder="$t('general.typeHere')"
          clearable
        />
      </n-form-item-gi>

      <!--  Collection Symbol -->
      <n-form-item-gi
        :span="4"
        path="symbol"
        :label="infoLabel('collectionSymbol')"
        :label-props="{ for: 'symbol' }"
      >
        <n-input
          v-model:value="collectionStore.form.base.symbol"
          :minlength="1"
          :maxlength="8"
          :input-props="{ id: 'symbol' }"
          :placeholder="$t('general.typeHere')"
          clearable
        />
      </n-form-item-gi>
    </n-grid>

    <!--  Chain -->
    <n-form-item path="chain" :label="infoLabel('collectionChain')" :label-props="{ for: 'chain' }">
      <select-options
        v-model:value="collectionStore.form.base.chain"
        :options="chains"
        :input-props="{ id: 'chain' }"
        :placeholder="$t('general.pleaseSelect')"
        filterable
        clearable
      />
    </n-form-item>

    <!--  Collection type -->
    <n-form-item
      v-if="isFeatureEnabled(Feature.NFT_NESTABLE, authStore.getUserRoles())"
      path="collectionType"
      :label="infoLabel('collectionType')"
      :label-props="{ for: 'collectionType' }"
    >
      <select-options
        v-model:value="collectionStore.form.base.collectionType"
        :options="collectionTypes"
        :input-props="{ id: 'collectionType' }"
        :placeholder="$t('general.pleaseSelect')"
        filterable
        clearable
      />
    </n-form-item>

    <!--  Collection Use Gateway -->
    <n-form-item path="useApillonIpfsGateway" :show-label="false">
      <n-checkbox
        v-model:checked="collectionStore.form.base.useApillonIpfsGateway"
        size="medium"
        :label="infoLabel('collectionUseGateway')"
      />
    </n-form-item>

    <!--  Form submit -->
    <n-form-item :show-label="false">
      <input type="submit" class="hidden" :value="$t('form.proceed')" />
      <Btn type="primary" class="w-full mt-2" @click="handleSubmitForm">
        {{ $t('form.proceed') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

const $i18n = useI18n();
const message = useMessage();
const authStore = useAuthStore();
const collectionStore = useCollectionStore();
const { chains, collectionTypes, formRef, rules } = useCollection();

function infoLabel(field: string) {
  if (
    $i18n.te(`form.label.${field}`) &&
    $i18n.te(`nft.collection.labelInfo.${field}`) &&
    $i18n.t(`nft.collection.labelInfo.${field}`)
  ) {
    return [
      h('span', { class: 'mr-1' }, $i18n.t(`form.label.${field}`)),
      h(
        resolveComponent('IconInfo'),
        { size: 'sm', tooltip: $i18n.t(`nft.collection.labelInfo.${field}`) },
        ''
      ),
    ];
  }
  return $i18n.te(`form.label.${field}`) ? $i18n.t(`form.label.${field}`) : field;
}

// Submit
function handleSubmitForm(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors =>
        fieldErrors.map(error => message.warning(error.message || 'Error'))
      );
    } else {
      collectionStore.stepDeploy = NftDeployStep.BEHAVIOR;
    }
  });
}
</script>
