<template>
  <div>
    <ol>
      <li>1. Login to your DNS server or domain registrar</li>
      <li>2. Add or edit DNS records described below:</li>
      <!-- <li>2. Change or add a new A record for the chosen domain with the following IP: 52.19.92.40</li>
      <li>
        3. Open Hosting service in Apillon Dashboard, move to the Production tab and enter your domain
      </li>
      <li>4. Back in the DNS editor add a new TXT record with the following inputs:</li> -->
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
      <span>52.19.92.40</span>
      <span class="inline-block cursor-pointer ml-2" @click="copyToClipboard(`52.19.92.40`)">
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

const websiteStore = useWebsiteStore();
</script>
