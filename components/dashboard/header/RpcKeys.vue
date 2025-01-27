<template>
  <Heading>
    <slot>
      <n-space align="center">
        <NuxtLink @click.native="goBack">
          <span class="icon-back text-2xl align-sub cursor-pointer"></span>
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
