<template>
  <div>
    <Headline :title="$t('simplet.wizard.selectType')" />
    <CardSelect
      v-for="simplet in simpletStore.templates"
      :key="simplet.id"
      :icon="`simplet/${simplet.name}`"
      :title="t(`simplet.${simplet.name}.name`)"
      :content="simplet.description || ''"
      :tags="translateItems(`simplet.${simplet.name}.usage`)"
      :selected="selectedType?.name === simplet.name"
      dark
      @click="selectedType = simplet"
    >
    </CardSelect>
  </div>
</template>

<script setup lang="ts">
defineExpose({ nextStep });
const { t } = useI18n();
const message = useMessage();
const simpletStore = useSimpletStore();

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
