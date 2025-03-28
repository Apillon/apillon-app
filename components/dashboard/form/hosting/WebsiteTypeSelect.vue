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
import { NftMetadataStep } from '~/lib/types/nft';

defineExpose({ nextStep });
const { t } = useI18n();
const message = useMessage();
const websiteStore = useWebsiteStore();

const selectedType = ref();

function nextStep(next: number) {
  if (selectedType.value) {
    websiteStore.form.type = selectedType.value;
  }
}
</script>
