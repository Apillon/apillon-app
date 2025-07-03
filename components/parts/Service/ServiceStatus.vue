<template>
  <Notice v-if="showNotification" class="relative inline-flex items-center pr-12" :type="notificationType">
    <span class="mr-2 inline-block">
      {{ serviceStatus.message }}
    </span>
    <span v-if="serviceStatus.url" class="mr-2 inline-block">
      <a :href="serviceStatus.url" class="text-bg-dark underline" target="_blank">
        {{ $t('general.readMore') }}
      </a>
    </span>
    <button class="absolute right-4 top-1/2 -translate-y-1/2" @click="close">
      <span class="icon-close align-middle text-xl text-bodyDark"></span>
    </button>
  </Notice>
</template>

<script lang="ts" setup>
const props = defineProps({
  serviceStatus: {
    type: Object as PropType<ServiceStatusInterface>,
    default: null,
  },
});

const notificationClosed = ref<boolean>(false);

const notificationType = computed(() => {
  return ServiceStatusType[props.serviceStatus.type]?.toLowerCase();
});

const showNotification = computed(() => {
  const data = getLS();
  return !notificationClosed.value && !Object.keys(data).includes(`${props.serviceStatus.id}`);
});

function close() {
  notificationClosed.value = true;

  const data = getLS();
  data[`${props.serviceStatus.id}`] = Date.now().toString();
  localStorage.setItem(LS_KEYS.SERVICE_STATUS, JSON.stringify(data));
}

function getLS(): Record<string, any> {
  try {
    const data = JSON.parse(localStorage.getItem(LS_KEYS.SERVICE_STATUS) || '{}');
    return typeof data === 'object' ? data : {};
  } catch (error) {
    console.warn(error);
  }
  return {};
}
</script>

<style lang="postcss" module></style>
