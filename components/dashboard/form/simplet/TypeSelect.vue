<template>
  <div>
    <Headline :title="$t('hosting.website.selectType')" />
    <CardSelect
      v-for="(simplet, key) in simpletsContent"
      :key="key"
      :icon="simplet.iconSvg"
      :icon-class="simplet.icon"
      :title="simplet.name"
      :content="simplet.description"
      :selected="selectedType === Number(simplet.id)"
      @click="selectedType = Number(simplet.id)"
    />
  </div>
</template>

<script setup lang="ts">
defineExpose({ nextStep });
const { t } = useI18n();
const message = useMessage();
const simpletStore = useSimpletStore();
const { simpletsContent } = useSimplet();

const selectedType = ref(simpletStore.form.type);

function nextStep() {
  if (selectedType.value) {
    simpletStore.resetForm();
    simpletStore.form.type = selectedType.value;
  } else {
    message.warning(t('simplet.wizard.selectType'));
  }
}
</script>
