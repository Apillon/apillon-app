<template>
  <vue3-ts-jsoneditor
    v-model:json="chatStore.settings"
    mode="text"
    :readOnly="true"
    :mainMenuBar="true"
    :navigationBar="true"
    :statusBar="true"
    darkTheme
  />
</template>

<script lang="ts" setup>
import vue3TsJsoneditor from 'vue3-ts-jsoneditor';

const chatStore = useChatStore();
</script>
