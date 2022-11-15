<template><div>Index</div></template>

<script lang="ts" setup>
const router = useRouter();
onBeforeMount(() => {
  router.push({ name: 'login' });
});
</script>
