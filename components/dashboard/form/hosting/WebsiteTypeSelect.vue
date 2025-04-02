<template>
  <div>
    <h2 class="mb-6 text-xl font-semibold">{{ $t('hosting.website.selectType') }}</h2>
    <CardSelect
      icon="social/github"
      :title="$t('hosting.website.githubType')"
      :content="$t('hosting.website.githubTypeDescription')"
      :selected="selectedType === WebsiteType.GITHUB"
      @click="selectedType = WebsiteType.GITHUB"
    />
    <CardSelect
      icon="icon/file"
      :title="$t('hosting.website.basicType')"
      :content="$t('hosting.website.basicTypeDescription')"
      :selected="selectedType === WebsiteType.BASIC"
      @click="selectedType = WebsiteType.BASIC"
    />
  </div>
</template>

<script setup lang="ts">
defineExpose({ nextStep });
const message = useMessage();
const websiteStore = useWebsiteStore();

const selectedType = ref(websiteStore.form.type);

function nextStep() {
  if (selectedType.value) {
    websiteStore.form.type = selectedType.value;
  } else {
    message.warning(t('hosting.website.selectType'));
  }
}
</script>
