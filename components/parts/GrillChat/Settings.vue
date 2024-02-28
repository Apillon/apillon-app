<template>
  <h3 v-if="postId" class="my-4">{{ $t('social.post.settings') }}</h3>

  <n-space v-if="postId" class="mb-8" size="large" vertical>
    <div>
      <strong>{{ $t('social.settings.theme') }}</strong>
      <n-switch v-model:value="darkTheme" />
    </div>

    <div>
      <strong>{{ $t('social.settings.back') }}</strong>
      <n-switch v-model:value="enableBackButton" />
    </div>

    <div>
      <strong>{{ $t('social.settings.login') }}</strong>
      <n-switch v-model:value="enableLoginButton" />
    </div>

    <div>
      <strong>{{ $t('social.settings.autofocus') }}</strong>
      <n-switch v-model:value="enableInputAutofocus" />
    </div>
  </n-space>

  <CodeBlock :code="code" lang="js" theme="github-dark" highlightjs :style="codeSize" />
</template>

<script lang="ts" setup>
import CodeBlock from 'vue3-code-block';

const props = defineProps({
  spaceId: { type: String, required: true },
  postId: { type: String, default: '' },
});

const postStore = usePostStore();

const darkTheme = ref<boolean>(true);
const enableBackButton = ref<boolean>(true);
const enableLoginButton = ref<boolean>(true);
const enableInputAutofocus = ref<boolean>(true);

const settings = computed(() => {
  return props.postId
    ? {
        theme: darkTheme.value ? 'dark' : 'light',
        widgetElementId: 'grill',
        hub: { id: props.spaceId },
        channel: {
          type: 'channel',
          id: props.postId,
          settings: {
            enableBackButton: enableBackButton.value,
            enableLoginButton: enableLoginButton.value,
            enableInputAutofocus: enableInputAutofocus.value,
          },
        },
      }
    : {
        theme: darkTheme.value ? 'dark' : 'light',
        widgetElementId: 'grill',
        hub: { id: props.spaceId },
      };
});

const code = computed(() => {
  return `// 1. Installation
yarn add @subsocial/grill-widget

// 2. Add the div HTML tag with an id of grill to your app.
<div id="grill"></div>

// 3. Setup config
const config = ${JSON.stringify(settings.value, null, 2)}

// 4. Call grill.init(config).
  // a. Using as a JS/TS module
import grill from '@subsocial/grill-widget'    
grill.init(config)

  // b) Use as a global variable (CDN)
window.GRILL.init(config)`;
});

const codeSize = ref({ 'min-height': `${22 * code.value.split('\n').length}px` });

watch(
  () => settings.value,
  (newSettings, oldSettings) => {
    if (oldSettings && newSettings && JSON.stringify(oldSettings) !== JSON.stringify(newSettings)) {
      postStore.settings = newSettings;
    }
  }
);
</script>
