<template>
  <div>
    <ol>
      <li>1. Open your DNS editor</li>
      <li>2. Change A record or add a new A record with the following IP: 52.19.92.40</li>
      <li>
        3. Open Hosting service in Apillon Dashboard, move to the Production tab and copy the
        provided URL
      </li>
      <li>4. Back in the DNS editor add a new TXT record with the following inputs:</li>
    </ol>
    <br />

    <h4>TXT Record:</h4>
    <p>
      <strong>Hostname: </strong>
      <template v-if="dataStore.webpage.active.domain || domain">
        <span> _dnslink.{{ dataStore.webpage.active.domain || domain }} </span>
        <button
          class="ml-2"
          @click="copyToClipboard(`_dnslink.${dataStore.webpage.active.domain || domain}`)"
        >
          <span class="icon-copy"></span>
        </button>
      </template>
      <span v-else>_dnslink.yourdomain.com</span>
    </p>
    <p v-if="dataStore.bucket.active.IPNS" class="lg:whitespace-nowrap">
      <strong>Value: </strong>
      <span>dnslink=/ipns/{{ dataStore.bucket.active.IPNS }}</span>
      <button
        class="ml-2"
        @click="copyToClipboard(`dnslink=/ipns/${dataStore.bucket.active.IPNS}`)"
      >
        <span class="icon-copy"></span>
      </button>
    </p>
    <p v-else class="lg:whitespace-nowrap">
      <strong>Value: </strong>
      <span>dnslink=/ipns/yourIPNS</span>
    </p>
    <br />

    <h4>TXT Record Example:</h4>
    <p>
      <strong>Hostname: </strong>
      <span>dnslink.google.com</span>
    </p>
    <p class="lg:whitespace-nowrap">
      <strong>Value: </strong>
      <span>dnslink=/ipns/k2k4r8jr49vcd16dqpge14mkaghgvm04bscv9zp8nhodzrwx5uw519u0</span>
    </p>
    <br />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  domain: { type: String, default: '' },
});

const dataStore = useDataStore();
</script>
