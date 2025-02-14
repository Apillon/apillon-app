<template>
  <Modal v-model:show="modalVisible" class="hide-header text-center">
    <h2 class="mb-2">
      {{ $t('assetHub.leave.title') }}
    </h2>
    <p>{{ $t('assetHub.leave.info') }}</p>

    <Btn type="primary" class="mt-8 w-full" @click="router.push(nextRoute?.fullPath || '/dashboard')">
      {{ $t('assetHub.leave.anyway') }}
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
