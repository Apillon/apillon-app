<template>
  <div class="card p-4 md:p-6 lg:p-8">
    <h6>{{ $t('hosting.github.template') }}</h6>
    <p class="mb-4 mt-2">{{ $t('hosting.github.templateInfo') }}</p>
    <div class="grid grid-cols-2 gap-4">
      <div
        v-for="(repo, key) in apillonRepos.slice(0, showAll ? apillonRepos.length : 4)"
        :key="key"
        class="hoverable relative overflow-hidden rounded border border-transparent bg-bg-lighter hover:border-yellow"
        @click="selectRepo(repo)"
      >
        <Image :src="repo.image" height="104" :alt="repo.name" />
        <div class="flex h-8 items-center px-2 py-1">
          <span class="text-xs capitalize">{{ repo.name.replaceAll('-', ' ') }}</span>
        </div>
        <div class="absolute top-0 hidden h-full w-full bg-bg-dark/20">
          <div class="flex-cc h-full">
            <Btn type="primary" size="small" class="!min-w-0">
              {{ $t('general.import') }}
            </Btn>
          </div>
        </div>
      </div>
    </div>
    <div v-if="apillonRepos.length > 4 && !showAll" class="mt-2">
      <Btn type="link" @click="showAll = !showAll">
        {{ $t('hosting.github.browseAll') }}
      </Btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['selectRepo']);
const websiteStore = useWebsiteStore();

const showAll = ref<boolean>(false);

function selectRepo(repo: GithubRepo) {
  websiteStore.form.branchName = repo.default_branch;
  websiteStore.form.repoId = repo.id;
  websiteStore.form.repoName = repo.name;
  websiteStore.form.repoOwnerName = repo.owner.login;
  websiteStore.form.repoUrl = repo.clone_url;
  emit('selectRepo');
}
</script>
