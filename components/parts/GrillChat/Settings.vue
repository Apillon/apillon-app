<template>
  <vue3-ts-jsoneditor
    v-model:json="chatStore.settings"
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

  <FormChatSpace class="mt-10" />
</template>

<script lang="ts" setup>
import vue3TsJsoneditor from 'vue3-ts-jsoneditor';

const emit = defineEmits(['close']);

const message = useMessage();
const chatStore = useChatStore();

const loading = ref<boolean>(false);
const newSettings = ref<string>('');

onMounted(() => {
  chatStore.getSpaces();
});

const onChange = change => {
  newSettings.value = change.text;
};

const onError = error => {
  console.error(error);
};

function updateChatSettings() {
  if (!newSettings.value || newSettings.value.length < 10) {
    message.warning('Make some changes');
  } else if (JSON.stringify(JSON.parse(newSettings.value)) === JSON.stringify(chatStore.settings)) {
    message.warning('Settings are equal to the current settings');
  } else {
    loading.value = true;
    chatStore.settings = JSON.parse(newSettings.value);

    setTimeout(() => {
      emit('close');
    }, 2000);
  }
}
</script>
