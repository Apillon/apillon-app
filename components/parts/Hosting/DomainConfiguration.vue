<template>
  <div>
    <ol>
      <li>1. Login to your DNS server or domain registrar</li>
      <li>2. Add or edit DNS records described below:</li>
    </ol>
    <br />

    <h4>A Record:</h4>
    <p>
      <strong>Hostname: </strong>
      <template v-if="websiteStore.active.domain || domain">
        <span> {{ websiteStore.active.domain || domain }} </span>
        <span
          class="inline-block cursor-pointer ml-2"
          @click="copyToClipboard(`${websiteStore.active.domain || domain}`)"
        >
          <span class="icon-copy"></span>
        </span>
      </template>
      <span v-else>&lt;your domain name&gt;</span>
    </p>
    <p class="lg:whitespace-nowrap">
      <strong>Value: </strong>
      <span>{{ ip }}</span>
      <span class="inline-block cursor-pointer ml-2" @click="copyToClipboard(ip)">
        <span class="icon-copy"></span>
      </span>
    </p>
    <br />

    <h4>TXT Record:</h4>
    <p>
      <strong>Hostname: </strong>
      <template v-if="websiteStore.active.domain || domain">
        <span> _dnslink.{{ websiteStore.active.domain || domain }} </span>
        <span
          class="inline-block cursor-pointer ml-2"
          @click="copyToClipboard(`_dnslink.${websiteStore.active.domain || domain}`)"
        >
          <span class="icon-copy"></span>
        </span>
      </template>
      <span v-else>_dnslink.&lt;your domain name&gt;</span>
    </p>
    <p v-if="link.length > 10" class="lg:whitespace-nowrap">
      <strong>Value: </strong>
      <span>dnslink=/{{ link }}</span>
      <span class="inline-block cursor-pointer ml-2" @click="copyToClipboard(`dnslink=/${link}`)">
        <span class="icon-copy"></span>
      </span>
    </p>
    <p v-else class="lg:whitespace-nowrap">
      <strong>Value: </strong>
      <span v-if="websiteStore.active.domain && websiteStore.active.w3ProductionLink">
        dnslink={{ parseIpfsFromLink(websiteStore.active.w3ProductionLink) }}
      </span>
      <span v-else>dnslink=/ipns/&lt;production IPNS address&gt;</span>
    </p>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  domain: { type: String, default: '' },
});

const dataStore = useDataStore();
const ipfsStore = useIpfsStore();
const websiteStore = useWebsiteStore();

const ip = computed(() => ipfsStore.info.loadBalancerIp || '52.19.92.40');

const link = computed(() =>
  websiteStore.active.ipnsProduction
    ? `ipns/${websiteStore.active.ipnsProduction}`
    : `ipfs/${websiteStore.active.cidProduction}`
);

onMounted(() => {
  ipfsStore.getIpfsInfo(dataStore.projectUuid);
});

const parseIpfsFromLink = (link: string) => {
  const match = link.match(/\/ipfs\/[^\/?]+/);
  return match && match.length ? match[0] : '';
};
</script>
