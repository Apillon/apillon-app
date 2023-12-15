<template>
  <n-space class="pb-8" :size="16" vertical>
    <HostingPreviewLink
      :link="ipfsGateway"
      :title="$t('storage.ipfs.title')"
      :info="$t('storage.ipfs.ipfsInfo')"
      copy
    />
    <HostingPreviewLink
      :link="ipnsGateway"
      :title="$t('storage.ipfs.ipns')"
      :info="$t('storage.ipfs.ipnsInfo')"
      copy
    />
    <HostingPreviewLink :link="gateway.project_uuid" :title="$t('storage.ipfs.project')" copy />
    <HostingPreviewLink
      :link="gateway.secret"
      :title="$t('general.secret')"
      :info="$t('storage.ipfs.secretInfo')"
      copy
    />
    <Secret
      :secret="gateway.secret"
      :title="$t('general.secret')"
      :info="$t('storage.ipfs.secretInfo')"
      copy
    />
  </n-space>
</template>

<script lang="ts" setup>
const props = defineProps({
  gateway: { type: Object as PropType<IpfsInterface>, required: true },
});

const ipfsGateway = computed(() => {
  return props.gateway?.subdomainGateway
    ? `https://<CIDv1>.${props.gateway.subdomainGateway}`
    : props.gateway?.ipfsGateway || '';
});
const ipnsGateway = computed(() => {
  return props.gateway?.subdomainGateway
    ? `https://<IPNS>.${props.gateway.subdomainGateway}`
    : props.gateway?.ipnsGateway || '';
});
</script>
