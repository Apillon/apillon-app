<template>
  <Heading>
    <slot>
      <n-space align="center">
        <NuxtLink @click="goBack">
          <span class="icon-back cursor-pointer align-sub text-2xl"></span>
        </NuxtLink>
        <h1>{{ $t('rpc.apiKey.management') }}</h1>
      </n-space>
    </slot>
  </Heading>
</template>
<script lang="ts" setup>
const $router = useRouter();

const goBack = () => {
  $router.go(-1);
};
</script>
