<template>
  <div>
    <Headline :title="$t('simplet.wizard.selectType')" />
    <CardSelect
      v-for="simplet in simpletStore.templates"
      :key="simplet.id"
      :icon="`simplet/${simplet.name}`"
      :title="t(`simplet.${simplet.name}.name`)"
      :content="simplet.description || ''"
      :usage="translateItems(`simplet.${simplet.name}.usage`)"
      :selected="selectedType?.name === simplet.name"
      @click="selectedType = simplet"
    >
      <template #additional>
        <div class="mt-2 flex flex-wrap gap-2">
          <Tag
            v-for="(item, key) in translateItems(`simplet.${simplet.name}.usage`)"
            :key="key"
            :type="item.includes('No code') ? 'success' : 'default'"
          >
            {{ item }}
          </Tag>
        </div>
      </template>
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
