<template>
  <Btn class="locked w-full" type="secondary" @click="showModalConfiguration = true">
    {{ $t('hosting.domain.configure') }}
  </Btn>

  <modal
    v-model:show="showModalConfiguration"
    class="!w-auto max-w-[100vw]"
    title="How to setup a domain for Apillon hosting?"
  >
    <HostingDomainConfiguration />
  </modal>
</template>

<script lang="ts" setup>
const showModalConfiguration = ref<boolean>(false);
</script>
