<template>
  <vue3-ts-jsoneditor
    v-model:text="config"
    mode="text"
    :statusBar="false"
    :mainMenuBar="false"
    darkTheme
    @error="onError"
    @focus="onFocus"
    @blur="onBlur"
  />
</template>

<script lang="ts" setup>
import vue3TsJsoneditor from 'vue3-ts-jsoneditor';

const emits = defineEmits(['close']);

const config = ref<string>(`{
  "widgetElementId": "grillChat",
  "hub": { "id": "YOUR-HUB_ID" },
  "channel": {
    "type": "resource",
    "resource": {
      "schema": "social",
      "app": "twitter",
      "resourceType": "profile",
      "resourceValue": { "id": "elonmusk" }
    },
    "settings": {
      "enableBackButton": false,
      "enableLoginButton": false,
      "enableInputAutofocus": true
    },
    "metadata": {
      "title": "Elon Musk",
      "body": "Onchain discussion about Elon Musk"
    }
  },
  "theme": "light"
}`);
console.log(config);

const onError = error => {
  // onError
};

const onFocus = () => {
  // onFocus
};

const onBlur = () => {
  // onBlur
};
</script>
