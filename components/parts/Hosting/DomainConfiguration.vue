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
    <p v-if="websiteStore.active.ipnsProduction" class="lg:whitespace-nowrap">
      <strong>Value: </strong>
      <span>dnslink=/ipns/{{ websiteStore.active.ipnsProduction }}</span>
      <span
        class="inline-block cursor-pointer ml-2"
        @click="copyToClipboard(`dnslink=/ipns/${websiteStore.active.ipnsProduction}`)"
      >
        <span class="icon-copy"></span>
      </span>
    </p>
    <p v-else class="lg:whitespace-nowrap">
      <strong>Value: </strong>
      <span>dnslink=/ipns/&lt;production IPNS address&gt;</span>
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

onMounted(() => {
  ipfsStore.getIpfsInfo(dataStore.projectUuid);
});
</script>
