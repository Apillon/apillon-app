<template>
  <vue3-ts-jsoneditor
    v-model:json="settingsStore.grillChatSettings"
    mode="text"
    :statusBar="false"
    :mainMenuBar="true"
    darkTheme
    @change="onChange"
    @error="onError"
  />
  <Btn class="mt-4" type="secondary" :loading="loading" @click="updateChatSettings">
    {{ $t('form.update') }}
  </Btn>
</template>

<script lang="ts" setup>
import vue3TsJsoneditor from 'vue3-ts-jsoneditor';

const emit = defineEmits(['close']);

const message = useMessage();
const settingsStore = useSettingsStore();

const loading = ref<boolean>(false);
const newSettings = ref<string>('');

const onChange = change => {
  newSettings.value = change.text;
};

const onError = error => {
  console.error(error);
};

function updateChatSettings() {
  if (!newSettings.value || newSettings.value.length < 10) {
    message.warning('Make some changes');
  } else if (
    JSON.stringify(JSON.parse(newSettings.value)) ===
    JSON.stringify(settingsStore.grillChatSettings)
  ) {
    message.warning('Settings are equal to the current settings');
  } else {
    loading.value = true;
    settingsStore.grillChatSettings = JSON.parse(newSettings.value);

    setTimeout(() => {
      emit('close');
    }, 2000);
  }
}
</script>
