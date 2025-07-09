<template>
  <div>
    <Btn
      v-if="editDomainEnabled"
      class="locked w-full"
      type="secondary"
      :disabled="authStore.isAdmin()"
      @click="modalWebsiteDomainVisible = true"
    >
      <span v-if="websiteStore.active.domain"> {{ $t('hosting.domain.update') }}</span>
      <span v-else> {{ $t('hosting.domain.add') }}</span>
    </Btn>
    <n-tooltip v-else placement="top" :trigger="isMd ? 'hover' : 'click'">
      <template #trigger>
        <Btn class="locked w-full cursor-default !bg-primary/50" type="primary">
          <span v-if="websiteStore.active.domain"> {{ $t('hosting.domain.update') }}</span>
          <span v-else> {{ $t('hosting.domain.add') }}</span>
        </Btn>
      </template>
      <span>{{ $t('hosting.domain.editDisabled') }}</span>
    </n-tooltip>

    <!-- Modal -  Domain preview -->
    <Modal v-model:show="modalWebsiteDomainVisible" :title="$t('hosting.domain.edit')">
      <HostingDomain v-bind="$attrs" :frontend-uuid="simpletStore.active.frontend_uuid" />
    </Modal>
  </div>
</template>

<script lang="ts" setup>
const { isMd } = useScreen();
const authStore = useAuthStore();
const simpletStore = useSimpletStore();
const websiteStore = useWebsiteStore();

const modalWebsiteDomainVisible = ref<boolean>(false);

const editDomainEnabled = computed<boolean>(() => {
  const time = websiteStore.active?.domainChangeDate;
  return !time || new Date(time).getTime() + 15 * 60 * 1000 < Date.now();
});
</script>
