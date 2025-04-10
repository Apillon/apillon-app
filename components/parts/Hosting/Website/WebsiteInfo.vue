<template>
  <div class="flex h-full flex-col items-start justify-between gap-4 md:flex-row">
    <div class="relative w-1/4 overflow-hidden rounded border border-transparent bg-bg-lighter">
      <div class="min-h-24 bg-bg-dark">
        <Image :src="websiteStore.active?.image || ''" height="104" :alt="websiteStore.active.name" />
      </div>
      <div class="flex h-8 items-center px-2 py-1">
        <span class="text-xs capitalize">{{ websiteStore.active.name.replaceAll('-', ' ') }}</span>
      </div>
    </div>
    <n-table class="plain" :bordered="false" single-line>
      <tbody>
        <tr v-for="(item, key) in data" :key="key">
          <td :class="{ '!border-b-0': key + 1 === data.length }">
            <span class="flex items-center gap-1">
              <span class="text-white lg:whitespace-nowrap">{{ item.label }}</span>
              <IconInfo v-if="item.info" :tooltip="item.info" size="sm" />
            </span>
          </td>
          <td :class="{ '!border-b-0': key + 1 === data.length }">
            <component :is="item.component" v-if="item.component" v-bind="item.data" />
            <TableLink v-else-if="item.link && item.value" class="w-full" :link="item.link" :text="item.value" />
            <TableEllipsis v-else-if="item.copy" class="w-full justify-between" :text="item.value || ''" />
            <p v-else class="w-full">{{ item.value }}</p>
          </td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const storageStore = useStorageStore();
const websiteStore = useWebsiteStore();
const deploymentStore = useDeploymentStore();

onMounted(() => {
  storageStore.getRepos();
});

const activeRepo = computed(() =>
  storageStore.repos.find(repo => repo.id === deploymentStore.deploymentConfig?.repoId)
);

const data = computed(() => {
  return [
    {
      label: t('hosting.website.name'),
      value: websiteStore.active.name,
    },
    {
      label: t('hosting.website.description'),
      value: websiteStore.active.description,
      show: !!websiteStore.active?.description,
    },
    {
      label: t('hosting.website.uuid'),
      value: websiteStore.active.website_uuid,
      copy: true,
    },
    {
      label: t('hosting.ipfsLink'),
      link: websiteStore.active.w3ProductionLink,
      value: websiteStore.active.w3ProductionLink,
      info: t('hosting.ipnsInfo'),
      copy: true,
      show: !!websiteStore.active?.w3ProductionLink,
    },
    {
      label: t('hosting.website.domain'),
      link: websiteStore.active.domain,
      value: websiteStore.active.domain,
      show: !!websiteStore.active?.domain,
    },
    {
      label: t('dashboard.env'),
      value: t(
        `hosting.deployment.env.${!websiteStore.active?.w3ProductionLink ? DeploymentEnvironment.STAGING : DeploymentEnvironment.PRODUCTION}`
      ),
    },
    {
      label: t('hosting.deploymentStatus'),
      show: websiteStore.active?.lastDeploymentStatus !== null,
      component: resolveComponent('HostingDeploymentStatus'),
      data: {
        deploymentStatus: websiteStore.active?.lastDeploymentStatus,
      },
    },
    {
      label: t('dashboard.created'),
      component: resolveComponent('HostingWebsiteOwner'),
      show: !!deploymentStore.deploymentConfig?.repoOwnerName,
      data: {
        avatar: activeRepo.value?.owner.avatar_url,
        date: dateTimeToMonthDay(websiteStore.active.createTime),
        owner: deploymentStore.deploymentConfig?.repoOwnerName,
      },
    },
    {
      label: t('form.label.website.repository'),
      value: deploymentStore.deploymentConfig?.repoName,
      link: activeRepo.value?.html_url,
      show: !!deploymentStore.deploymentConfig?.repoName,
    },
    {
      label: t('form.label.website.branchName'),
      value: deploymentStore.deploymentConfig?.branchName,
      link: activeRepo.value?.html_url
        ? `${activeRepo.value?.html_url}/tree/${deploymentStore.deploymentConfig?.branchName}`
        : '',
      show: !!deploymentStore.deploymentConfig?.branchName,
    },
  ].filter(item => item?.show !== false);
});
</script>
