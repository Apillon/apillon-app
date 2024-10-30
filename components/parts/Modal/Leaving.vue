<template>
  <Modal v-model:show="modalVisible" class="text-center">
    <h2 class="mb-2 mt-6">
      {{ $t('dashboard.service.assetHub.leave.title') }}
    </h2>
    <p>{{ $t('dashboard.service.assetHub.leave.info') }}</p>

    <Btn type="primary" class="mt-8 w-full" @click="router.push(nextRoute?.fullPath || '/dashboard')">
      {{ $t('dashboard.service.assetHub.leave.anyway') }}
    </Btn>
    <Btn type="secondary" class="mt-2 w-full" @click="modalVisible = false">
      {{ $t('form.cancel') }}
    </Btn>
  </Modal>
</template>

<script lang="ts" setup>
import type { RouteLocationNormalized } from 'vue-router';

const router = useRouter();
const modalVisible = ref<boolean>(false);
const nextRoute = ref<RouteLocationNormalized | undefined>();

onBeforeRouteLeave(to => {
  if (!modalVisible.value) {
    modalVisible.value = true;
    nextRoute.value = to;
    return false;
  }
});
</script>
