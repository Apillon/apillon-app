<template>
  <n-form-item path="repoId" :label="$t('form.label.website.repository')" :label-props="{ for: 'repo' }">
    <n-select
      v-bind="$attrs"
      :loading="storageStore.loading"
      :placeholder="$t('form.placeholder.website.repository')"
      :options="repoOptions"
      filterable
      @update:value="handleUpdateValue"
    />
  </n-form-item>
</template>

<script lang="ts" setup>
import type { SelectOption } from 'naive-ui';

const storageStore = useStorageStore();
const websiteStore = useWebsiteStore();
const repoOptions = ref<SelectOption[]>([]);

onMounted(async () => {
  await storageStore.getGithubProjectConfig();
  if (storageStore.projectConfig) {
    await storageStore.getRepos();
    repoOptions.value = storageStore.repos.map((item: GithubRepo) => ({
      value: item.id,
      label: item.name,
    }));
  }
});

function handleUpdateValue(value: number) {
  const repo = storageStore.repos.find((item: GithubRepo) => item.id === value);
  if (repo) {
    websiteStore.form.repoName = repo.name;
    websiteStore.form.branchName = repo.default_branch;
    websiteStore.form.repoOwnerName = repo.owner.login;
    websiteStore.form.repoUrl = repo.clone_url;
  }
}
</script>
